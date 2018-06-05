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

const buttonLabelStyle = {
  margin: '0 0.5em'
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handlePopHistory = this.handlePopHistory.bind(this);
  }

  handlePopHistory(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.popHistory();
  }

  render () {
    return (
      <div
        style={this.props.style}
        className="btn-group"
        role="group"
      >
        <button
          className="btn btn-default btn-xs"
          disabled={graphApi.getHistorySize() <= 0}
          onClick={this.handlePopHistory}
          title="Undo the last action">
          <span
            style={buttonLabelStyle}
            className="fa fa-undo"
          />
        </button>
      </div>
    );
  }
}

export default connect(modelSelector, containerActions)(Container);

