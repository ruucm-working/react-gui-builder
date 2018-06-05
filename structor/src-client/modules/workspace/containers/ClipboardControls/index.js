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

const wideButtonLabelStyle = {
  margin: '0 0.5em',
  fontSize: '11px'
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick (e) {
    e.preventDefault();
    e.stopPropagation();
    const {handleBefore, handleFirst, handleLast, handleAfter, handleReplace} = this.props;
    const funcSignature = e.currentTarget.dataset.func;
    switch (funcSignature) {
      case 'pasteBefore':
        handleBefore();
        break;
      case 'pasteAfter':
        handleAfter();
        break;
      case 'pasteFirst':
        handleFirst();
        break;
      case 'pasteLast':
        handleLast();
        break;
      case 'pasteReplace':
        handleReplace();
        break;
      default:
        break;
    }
  }

  render () {
    const {selectionBreadcrumbsModel: {selectedKeys}} = this.props;

    let controlGroup = (
      <div className="btn-group" role="group">
        <button
          className="btn btn-default btn-xs"
          data-func="pasteBefore"
          disabled={!selectedKeys || selectedKeys.length <= 0}
          onClick={this.handleButtonClick}
          title="Append components before selected component">
          <span style={wideButtonLabelStyle}>
              <i className="umy-icon-arrow-plus-down"/>
          </span>
        </button>
        <button
          className="btn btn-default btn-xs"
          data-func="pasteFirst"
          disabled={!selectedKeys || selectedKeys.length <= 0}
          onClick={this.handleButtonClick}
          title="Insert components into selected component as the first child"
        >
          <span style={wideButtonLabelStyle}>
              <i className="umy-icon-arrow-plus-up rotate-clockwise"/>|
          </span>
        </button>
        <button
          className="btn btn-default btn-xs"
          disabled={!selectedKeys || selectedKeys.length <= 0}
          data-func="pasteReplace"
          onClick={this.handleButtonClick}
          title="Replace selected component"
        >
          <span style={wideButtonLabelStyle}>
            <i className="umy-icon-replace"/>
          </span>
        </button>
        <button
          className="btn btn-default btn-xs"
          data-func="pasteLast"
          disabled={!selectedKeys || selectedKeys.length <= 0}
          onClick={this.handleButtonClick}
          title="Insert components into selected component as the last child"
        >
          <span style={wideButtonLabelStyle}>
            |<i style={{marginTop: '.6em'}} className="umy-icon-arrow-plus-down rotate-clockwise"/>
          </span>
        </button>
        <button
          className="btn btn-default btn-xs"
          data-func="pasteAfter"
          disabled={!selectedKeys || selectedKeys.length <= 0}
          onClick={this.handleButtonClick}
          title="Append components after selected component"
        >
          <span style={wideButtonLabelStyle}>
            <i className="umy-icon-arrow-plus-up"/>
          </span>
        </button>
      </div>
    );
    return (
      <div style={this.props.style}>
        {controlGroup}
      </div>
    );
  }
}

export default connect(modelSelector, containerActions)(Container);

