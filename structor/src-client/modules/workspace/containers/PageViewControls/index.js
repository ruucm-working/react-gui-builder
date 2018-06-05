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
import { ADD_NEW, DUPLICATE, CHANGE_OPTIONS } from 'modules/workspace/containers/PageOptionsModal/actions';

const buttonLabelStyle = {
  margin: '0 0'
};

class Container extends Component {

  constructor (props) {
    super(props);
  }

  handleShowModal = (type) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.showModal(type);
  };

  handleDeletePage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.deletePage();
  };

  render () {
    const {style} = this.props;

    return (
      <div
        className="btn-group btn-group-justified"
        style={style}
        role="group"
      >
        <div
          className="btn-group"
          role="group"
        >
          <button
            key="changePageButton"
            className="btn btn-default btn-xs"
            onClick={this.handleShowModal(CHANGE_OPTIONS)}
            title="Change page properties">
            <span style={buttonLabelStyle}>
                <i className="fa fa-gears"/>
            </span>
          </button>
        </div>
        <div
          className="btn-group"
          role="group"
        >
          <button
            key="addPageButton"
            className="btn btn-default btn-xs"
            onClick={this.handleShowModal(ADD_NEW)}
            title="Create new page">
            <span style={buttonLabelStyle}>
                <i className="fa fa-plus"/>
            </span>
          </button>
        </div>
        <div
          className="btn-group"
          role="group"
        >
          <button
            key="copyPageButton"
            className="btn btn-default btn-xs"
            onClick={this.handleShowModal(DUPLICATE)}
            title="Clone current page">
            <span style={buttonLabelStyle}>
                <i className="fa fa-copy"/>
            </span>
          </button>
        </div>
        <div
          className="btn-group"
          role="group"
        >
          <button
            className="btn btn-default btn-xs"
            onClick={this.handleDeletePage}
            title="Delete current page"
          >
          <span style={buttonLabelStyle}>
            <i className="fa fa-trash-o"/>
          </span>
          </button>
        </div>
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);
