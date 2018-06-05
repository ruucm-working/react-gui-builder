/*
 * Copyright 2017 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { forOwn, includes } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { graphApi } from 'api';

let lastWaitTimer = undefined;
const wait = (testFunc, launchFunc) => {
  if (lastWaitTimer) {
    clearTimeout(lastWaitTimer);
    lastWaitTimer = undefined;
  }
  if (!testFunc()) {
    lastWaitTimer = setTimeout(() => { wait(testFunc, launchFunc); }, 3000);
  } else {
    launchFunc();
  }
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.handlePathnameChanged = this.handlePathnameChanged.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setupShortcuts = this.setupShortcuts.bind(this);
    this.removeShortcuts = this.removeShortcuts.bind(this);
  }

  componentDidMount () {

    const {componentModel: {pages, currentPagePath}} = this.props;
    if (currentPagePath) {
      this.frameWindow.src = '/structor-deskpage' + currentPagePath;
    }

    const {loadPage, pageLoaded} = this.props;
    const {setForCuttingKeys, setForCopyingKeys, setSelectedKey} = this.props;
    const {handleBefore, handleFirst, handleLast, handleAfter, handleReplace} = this.props;
    const {cloneSelected, deleteSelected, setHighlightSelectedKey} = this.props;
    loadPage();
    this.contentDocument = this.frameWindow.contentDocument;
    this.contentWindow = this.frameWindow.contentWindow;
    this.setupShortcuts();

    this.frameWindow.onload = ( () => {
      this.contentWindow.__pages = pages;
      this.contentWindow.onPageDidMount = (page) => {
        this.page = page;

        if (page) {
          let context = page.getContext();
          context.setGetter('pagePath', pathname => graphApi.getPagePath(pathname));
          context.setGetter('pageModel', pathname => graphApi.getWrappedModelByPagePath(pathname));
          context.setGetter('marked', pathname => graphApi.getMarkedKeysByPagePath(pathname));
          context.setGetter('mode', () => this.props.componentModel.isEditModeOn);
          context.setGetter('parentList', (selectedKey) => graphApi.getParentsList(selectedKey));

          context.addListener('componentClick.desk', this.handleComponentClick);
          context.addListener('pathnameChanged.desk', this.handlePathnameChanged);
          context.addListener('cut.desk', (keys) => { setForCuttingKeys(keys); });
          context.addListener('copy.desk', (keys) => { setForCopyingKeys(keys); });
          context.addListener('clone.desk', () => { cloneSelected(); });
          context.addListener('delete.desk', () => { deleteSelected(); });
          context.addListener('before.desk', () => { handleBefore(); });
          context.addListener('after.desk', () => { handleAfter(); });
          context.addListener('first.desk', () => { handleFirst(); });
          context.addListener('last.desk', () => { handleLast(); });
          context.addListener('replace.desk', () => { handleReplace(); });
          context.addListener('select.desk', (key) => { setSelectedKey(key); });
          context.addListener('highlight.desk', (key, isHighlighted) => { setHighlightSelectedKey(key, isHighlighted)});
        }

      };

      const initPage = () => {
        this.contentWindow.__createPageDesk();
        wait(() => this.contentWindow.pageReadyState === 'initialized', pageLoaded);
      };
      wait(() => this.contentWindow.pageReadyState === 'ready', initPage);
    });
  }

  componentWillUnmount () {
    this.removeShortcuts();
    this.contentDocument = undefined;
    this.contentWindow = undefined;
    this.page = undefined;
  }

  componentWillReceiveProps (nextProps) {
    const {componentModel} = this.props;
    const {componentModel: newComponentModel} = nextProps;
    if (newComponentModel.reloadPageCounter != componentModel.reloadPageCounter) {
      this.frameWindow.src = '/structor-deskpage' + newComponentModel.currentPagePath;
    } else if (newComponentModel.pagePathToChange != null
      && newComponentModel.pagePathToChange != componentModel.pagePathToChange) {
      if (this.page) {
        // only when page is already loaded
        this.page.changePath(newComponentModel.pagePathToChange);
      }
    }
  }

  componentWillUpdate (nextProps, nextState) {

    this.removeShortcuts();

    this.doUpdatePageModel = false;
    this.doUpdateMarks = false;

    const {componentModel} = this.props;
    const {componentModel: newComponentModel} = nextProps;

    if (newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter) {
      this.doUpdatePageModel = true;
    } else if (newComponentModel.markedUpdateCounter !== componentModel.markedUpdateCounter) {
      this.doUpdateMarks = true;
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const {componentModel} = this.props;
    const {componentModel: newComponentModel} = nextProps;
    return (
      nextProps.style.width !== this.props.style.width
      || newComponentModel.isEditModeOn !== componentModel.isEditModeOn
      || newComponentModel.markedUpdateCounter !== componentModel.markedUpdateCounter
      || newComponentModel.modelUpdateCounter !== componentModel.modelUpdateCounter
    );
  }

  componentDidUpdate () {
    this.setupShortcuts();
    if (this.page) {
      if (this.doUpdatePageModel) {
        const {componentModel} = this.props;
        //console.log('Updating page model: ' + componentModel.currentPagePath);
        this.page.updatePageModel({
          pathname: componentModel.currentPagePath,
        });
      }
      if (this.doUpdateMarks) {
        const {componentModel} = this.props;
        //console.log('Updating marked only');
        this.page.updateMarks({
          pathname: componentModel.currentPagePath
        });
      }
    }
  }

  handleComponentClick (key, isModifier, button) {
    const {
      setSelectedKey,
    } = this.props;
    setSelectedKey(key, isModifier, button);
  }

  handlePathnameChanged (pathname) {
    const {changePageRouteFeedback} = this.props;
    changePageRouteFeedback(pathname);
  }

  handleKeyDown (e) {
    //console.log('Key is down:' + e.which);
    //console.log('ActiveElement: ' + document.activeElement);

    let contentEditableElement = document.activeElement.attributes['contenteditable']
      ? document.activeElement.attributes['contenteditable'].value : false;
    let elementNameUpperCase = document.activeElement.tagName.toUpperCase();
    if (elementNameUpperCase !== 'INPUT'
      && elementNameUpperCase !== 'TEXTAREA'
      && elementNameUpperCase !== 'SELECT'
      && !contentEditableElement
      && !window.getSelection().toString()) {
      if (e.which === 8 || e.which === 46) { // Del or Backspace key
        const {deleteSelected} = this.props;
        e.stopPropagation();
        e.preventDefault();
        deleteSelected();
      } else if (e.metaKey || e.ctrlKey) {
        const {selectionBreadcrumbsModel: {selectedKeys}} = this.props;
        const {clipboardIndicatorModel: {clipboardKeys}} = this.props;
        const {setForCuttingKeys, setForCopyingKeys} = this.props;
        const {pasteBefore, pasteAfter, pasteFirst} = this.props;
        const {cloneSelected, popHistory} = this.props;

        switch (e.which) {
          case 68: // D key
            e.stopPropagation();
            e.preventDefault();
            cloneSelected();
            break;
          case 67: // C key
            e.stopPropagation();
            e.preventDefault();
            if (selectedKeys && selectedKeys.length > 0) {
              setForCopyingKeys(selectedKeys);
            }
            break;
          case 65: // A key
            e.stopPropagation();
            e.preventDefault();
            if (selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0) {
              pasteBefore(selectedKeys[0]);
            }
            break;
          case 73: // I key
            e.stopPropagation();
            e.preventDefault();
            if (selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0) {
              pasteFirst(selectedKeys[0]);
            }
            break;
          case 86: // V key
            e.stopPropagation();
            e.preventDefault();
            if (selectedKeys && selectedKeys.length === 1 && clipboardKeys && clipboardKeys.length > 0) {
              pasteAfter(selectedKeys[0]);
            }
            break;
          case 88: // X key
            e.stopPropagation();
            e.preventDefault();
            if (selectedKeys && selectedKeys.length > 0) {
              setForCuttingKeys(selectedKeys);
            }
            break;
          case 90: // Z key
            popHistory();
            e.stopPropagation();
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    }
  }

  setupShortcuts () {
    const {componentModel: {isEditModeOn}} = this.props;
    if (isEditModeOn) {
      if (this.contentWindow) {
        this.contentWindow.addEventListener('keydown', this.handleKeyDown, false);
      }
      window.addEventListener('keydown', this.handleKeyDown, false);
    } else {
      this.removeShortcuts();
    }
  }

  removeShortcuts () {
    if (this.contentWindow) {
      this.contentWindow.removeEventListener('keydown', this.handleKeyDown, false);
    }
    window.removeEventListener('keydown', this.handleKeyDown, false);
  }

  render () {
    return (
      <iframe
        ref={me => this.frameWindow = me}
        style={this.props.style}
        src={'/structor-deskpage/'}
      />
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

