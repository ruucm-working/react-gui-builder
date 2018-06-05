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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { graphApi } from 'api';

const labelStyle = {
  padding: '3px 6px',
  borderRadius: '3px',
  cursor: 'pointer',
  backgroundColor: 'rgb(227, 227, 227)',
  color: 'rgb(107, 107, 107)',
  marginRight: '0.3em',
  textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
};

const activeStyle = {
  padding: '2px 6px',
  borderRadius: '3px',
  backgroundColor: '#35b3ee',
  color: '#ffffff',
  cursor: 'pointer'
};

const makeTitle = (componentName) => {
  let titleComponentName = componentName;
  if (titleComponentName && titleComponentName.length > 30) {
    titleComponentName = titleComponentName.substr(0, 27) + '...';
  }
  return titleComponentName;
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleSetHighlightSelectedKey = this.handleSetHighlightSelectedKey.bind(this);
    this.handleRemoveHighlightSelectedKey = this.handleRemoveHighlightSelectedKey.bind(this);
    this.handleSetSelectedKey = this.handleSetSelectedKey.bind(this);
    this.handleRemoveSelectedKey = this.handleRemoveSelectedKey.bind(this);
  }

  handleSetHighlightSelectedKey (e) {
    const key = e.currentTarget.dataset.key;
    const {setHighlightSelectedKey} = this.props;
    setHighlightSelectedKey(key, true);
  }

  handleRemoveHighlightSelectedKey (e) {
    const key = e.currentTarget.dataset.key;
    const {setHighlightSelectedKey} = this.props;
    setHighlightSelectedKey(key, false);
  }

  handleSetSelectedKey (e) {
    e.preventDefault();
    e.stopPropagation();
    const key = e.currentTarget.dataset.key;
    const {setSelectedKey, setHighlightSelectedKey} = this.props;
    setHighlightSelectedKey(key, false);
    setSelectedKey(key);
  }

  handleRemoveSelectedKey (e) {
    e.preventDefault();
    e.stopPropagation();
    const key = e.currentTarget.dataset.key;
    const {setSelectedKey, setHighlightSelectedKey} = this.props;
    setHighlightSelectedKey(key, false);
    setSelectedKey(key, true);
  }

  render () {

    const {componentModel: {selectedKeys}, removeSelectedKeys} = this.props;

    let content = null;
    if (selectedKeys) {
      if (selectedKeys.length === 1) {
        const parentsList = graphApi.getParentsList(selectedKeys[0]);
        if (parentsList && parentsList.length > 1) {
          content = [];
          const rootItem = parentsList[parentsList.length - 1];
          content.push(
            <li
              key={'rootItem'}
              title="Clear selection"
            >
              <span
                style={labelStyle}
                onClick={() => {removeSelectedKeys();}}
              >
                  <i className="fa fa-times-circle fa-fw"
                     style={{opacity: '0.6'}}/>
                  <span>Selected:&nbsp;</span>
                  {/*<strong>*/}
                      {/*{(rootItem.modelNode.pageName ? makeTitle(rootItem.modelNode.pagePath) : 'Unknown')}*/}
                  {/*</strong>*/}
              </span>
            </li>
          );
          const showNumber = 3;
          const componentNumber = parentsList.length - 1;
          const lastIndex = componentNumber - 1;
          let restNumber = componentNumber > showNumber ? componentNumber - showNumber : 0;
          if (restNumber > 1) {
            content.push(
              <li key={'showMore'}>{restNumber + ' more...'}</li>
            );
          } else {
            restNumber = 0;
          }

          let item;
          for (let i = lastIndex - restNumber; i >= 0; i--) {
            item = parentsList[i];
            const childrenMenuItems = [];
            const childrenOfActive = graphApi.getChildNodes(item.key);
            if (childrenOfActive && childrenOfActive.length > 0) {
              childrenOfActive.forEach((child, index) => {
                childrenMenuItems.push(
                  <li key={'childMenuItem' + index}>
                    <a href="#"
                       style={{display: 'flex', alignItems: 'center'}}
                       data-key={child.key}
                       onClick={this.handleSetSelectedKey}
                       onMouseEnter={this.handleSetHighlightSelectedKey}
                       onMouseLeave={this.handleRemoveHighlightSelectedKey}>
                      {child.modelNode.type}
                    </a>
                  </li>
                );
              });
            }
            let componentTitle = makeTitle(item.modelNode.type);
            if (i !== 0) {
              content.push(
                <li key={i}>
                  <a href="#"
                     title={'Click to select ' + item.modelNode.type}
                     data-key={item.key}
                     onMouseEnter={this.handleSetHighlightSelectedKey}
                     onMouseLeave={this.handleRemoveHighlightSelectedKey}
                     onClick={this.handleSetSelectedKey}>
                    {componentTitle}
                  </a>
                  <span key={'menuMore'}
                        style={{margin: '0 0.5em', cursor: 'pointer'}}
                        title="Show nested components"
                        className="dropdown">
                      <span className="dropdown-toggle" data-toggle="dropdown">
                          <span className="caret"></span>
                      </span>
                      <ul className="dropdown-menu dropdown-menu-right"
                          role="menu"
                          style={{overflowY: 'auto', maxHeight: '12em'}}>
                          {childrenMenuItems}
                      </ul>
                  </span>
                </li>
              );
            } else {
              if (item.modelNode.namespace) {
                componentTitle += ' [' + item.modelNode.namespace + ']';
              }
              if (childrenMenuItems.length > 0) {
                content.push(
                  <li key={i}>
                    <span key={'menuMore'}
                          className="dropdown"
                          style={activeStyle}
                          data-key={item.key}>
                        <span className="dropdown-toggle" data-toggle="dropdown">
                            <span>{componentTitle}&nbsp;</span>
                            <span className="caret"/>
                        </span>
                        <ul className="dropdown-menu dropdown-menu-right"
                            role="menu"
                            style={{overflowY: 'auto', maxHeight: '12em'}}>
                            {childrenMenuItems}
                        </ul>
                    </span>
                  </li>
                );
              } else {
                content.push(
                  <li key={i}>
                    <span style={activeStyle}
                          data-key={item.key}
                          title={item.modelNode.type}
                          onMouseEnter={this.handleSetHighlightSelectedKey}
                          onMouseLeave={this.handleRemoveHighlightSelectedKey}>
                        {componentTitle}
                    </span>
                  </li>
                );
              }
            }
          }
          content = (
            <ol key='breadcrumb' className='breadcrumb' style={this.props.style}>
              {content}
            </ol>
          );
        }
      } else if (selectedKeys.length > 1) {
        content = [];
        content.push(
          <span key="rootKey"
                style={labelStyle}
                onClick={() => {removeSelectedKeys();}}>
                        <i className="fa fa-times-circle fa-fw"
                           style={{opacity: '0.6'}}/>
                        <span>Selected:&nbsp;&nbsp;</span>
                    </span>
        );
        const lastShowIndex = selectedKeys.length > 3 ? 3 : selectedKeys.length;
        let graphNode;
        let componentTitle;
        for (let i = 0; i < lastShowIndex; i++) {
          graphNode = graphApi.getNode(selectedKeys[i]);
          if (graphNode && graphNode.modelNode) {
            componentTitle = makeTitle(graphNode.modelNode.type);
            content.push(
              <span key={i}
                    style={activeStyle}
                    data-key={selectedKeys[i]}
                    title={'Remove ' + graphNode.modelNode.type + ' from selection list'}
                    onMouseEnter={this.handleSetHighlightSelectedKey}
                    onMouseLeave={this.handleRemoveHighlightSelectedKey}
                    onClick={this.handleRemoveSelectedKey}>
                                <i className="fa fa-times-circle fa-fw"
                                   style={{opacity: '0.6'}}/>
                {componentTitle}
                            </span>
            );
            if (i < lastShowIndex - 1) {
              content.push(<span key={'delimiter' + i}>&nbsp;&nbsp;</span>);
            }
          }
        }
        if (lastShowIndex !== selectedKeys.length) {
          let menuItems = [];
          for (let x = lastShowIndex; x < selectedKeys.length; x++) {
            graphNode = graphApi.getNode(selectedKeys[x]);
            if (graphNode && graphNode.modelNode) {
              menuItems.push(
                <li key={'menuItem' + x}>
                  <a href="#"
                     style={{display: 'flex', alignItems: 'center'}}
                     data-key={selectedKeys[x]}
                     title="Remove from selection list"
                     onMouseEnter={this.handleSetHighlightSelectedKey}
                     onMouseLeave={this.handleRemoveHighlightSelectedKey}
                     onClick={this.handleRemoveSelectedKey}>
                    <i className="fa fa-times-circle fa-fw"
                       style={{fontSize: '10px', opacity: '0.5'}}/>
                    {graphNode.modelNode.type}
                  </a>
                </li>
              );
            }
          }
          content.push(<span key={'delimiterForMenuMore'}>&nbsp;&nbsp;</span>);
          content.push(
            <span key={'menuMore'}
                  className="dropdown"
                  style={activeStyle}>
                            <span className="dropdown-toggle" data-toggle="dropdown">
                                <span>More...&nbsp;</span><span className="caret"></span>
                            </span>
                          <ul className="dropdown-menu dropdown-menu-right"
                              role="menu"
                              style={{overflowY: 'auto', maxHeight: '12em'}}>
                              {menuItems}
                          </ul>
                        </span>
          );
        }
        content = (
          <div style={this.props.style}>
            {content}
          </div>

        );
      }
    }
    if (!content) {
      content = (
        <div style={this.props.style}>
          <span style={labelStyle}>Nothing is selected</span>
        </div>

      );
    }

    return content;
  }
}

export default connect(modelSelector, containerActions)(Container);

