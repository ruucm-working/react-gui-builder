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

const buttonLabelStyle = {
  margin: '0 0.5em'
};

class Container extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    const {selectedKeys} = this.props;
    const {setForCuttingKeys, setForCopyingKeys, cloneSelected, moveSelected, deleteSelected} = this.props;
    if (selectedKeys) {
      return (
        <div style={this.props.style} className="btn-group" role="group">
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setForCopyingKeys(selectedKeys);
            }}
            title="Copy selected components to clipboard">
            <span style={buttonLabelStyle} className="fa fa-clipboard"/>
          </button>
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setForCuttingKeys(selectedKeys);
            }}
            title="Cut selected components to clipboard">
            <span style={buttonLabelStyle} className="fa fa-scissors"/>
          </button>
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              cloneSelected();
            }}
            title="Clone selected components">
            <span style={buttonLabelStyle} className="fa fa-clone"/>
          </button>
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveSelected(true);
            }}
            title="Move up selected components within their parents">
            <span style={buttonLabelStyle} className="fa fa-arrow-up"/>
          </button>
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveSelected(false);
            }}
            title="Move down selected components within their parents">
            <span style={buttonLabelStyle} className="fa fa-arrow-down"/>
          </button>
          <button
            className="btn btn-default btn-xs"
            disabled={selectedKeys.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteSelected();
            }}
            title="Delete selected components">
            <span style={buttonLabelStyle} className="fa fa-trash-o"/>
          </button>
        </div>
      );
    } else {
      return (<span style={{display: 'none'}}></span>);
    }
  }
}

export default connect(modelSelector, containerActions)(Container);

