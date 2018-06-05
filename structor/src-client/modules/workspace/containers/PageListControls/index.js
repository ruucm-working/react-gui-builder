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
import { CHANGE_OPTIONS } from 'modules/workspace/containers/PageOptionsModal/actions';

const buttonLabelStyle = {
  margin: '0 0.5em'
};

const makeTitle = (title) => {
  let adoptedTitle = title;
  if (adoptedTitle && adoptedTitle.length > 30) {
    adoptedTitle = adoptedTitle.substr(0, 30) + '...';
  }
  return adoptedTitle;
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleChangePath = this.handleChangePath.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  handleChangePath (e) {
    e.stopPropagation();
    e.preventDefault();
    const {changePageRoute} = this.props;
    const pagePath = e.currentTarget.dataset.path;
    changePageRoute(pagePath);
  }

  handleShowModal (e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.showModal(CHANGE_OPTIONS);
  }

  handleChangeViewport = (widthValue) => (e) => {
    this.props.changeViewportWidth(widthValue);
  };

  render () {
    const {deskPageModel, deskModel} = this.props;
    const pages = deskPageModel.pages;
    let pagesList = [];
    let currentRoutePathLabel = makeTitle(deskPageModel.currentPagePath);
    if (pages && pages.length > 0) {
      let indexRouteLabel = ' [Index]';
      pages.forEach((page, index) => {
        let routePathLabel = makeTitle(page.pagePath);
        if (index === 0) {
          if (page.pagePath === deskPageModel.currentPagePath) {
            currentRoutePathLabel += indexRouteLabel;
          }
          routePathLabel += indexRouteLabel;
        }
        pagesList.push(
          <li key={routePathLabel + index}>
            <a
              data-path={page.pagePath}
              onClick={this.handleChangePath}
              href="#"
              title={page.pagePath}
            >
              {routePathLabel}
            </a>
          </li>
        );
      });
    }
    return (
      <div
        style={this.props.style}
        className="btn-group"
        role="group"
      >
        <div
          className="btn-group"
          role="group"
        >
          <div
            key="pageWidthButton"
            className="btn-group"
            role="group">
            <button
              className="btn btn-default btn-xs dropdown-toggle"
              data-toggle="dropdown">
              <span style={buttonLabelStyle}>{deskModel.iframeWidth}</span>
              <span className="caret"/>
              &nbsp;&nbsp;
            </button>
            <ul
              className="dropdown-menu"
              role="menu">
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('100%')}>
                  100%
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('1800px')}>
                  1800px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('1200px')}>
                  1200px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('1100px')}>
                  1100px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('1000px')}>
                  1000px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('900px')}>
                  900px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('770px')}>
                  770px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('700px')}>
                  700px
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={this.handleChangeViewport('340px')}>
                  340px
                </a>
              </li>

            </ul>
          </div>
        </div>
        <button
          className="btn btn-default btn-xs"
          onClick={this.handleShowModal}
          title="View page info"
        >
                    <span>
                        &nbsp;&nbsp;
                      {currentRoutePathLabel}
                      &nbsp;&nbsp;
                    </span>
        </button>
        <div
          className="btn-group"
          role="group"
        >
          <button
            className="btn btn-default btn-xs dropdown-toggle"
            data-toggle="dropdown"
          >
            &nbsp;&nbsp;
            <span className="caret"/>
            &nbsp;&nbsp;
          </button>
          <ul
            className="dropdown-menu"
            role="menu"
            style={{overflowY: 'auto', maxHeight: '30em'}}
          >
            <li
              role="presentation"
              className="dropdown-header">
              Switch to:
            </li>
            {pagesList}
          </ul>
        </div>
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);
