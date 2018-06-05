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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

class Container extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this._mountNode = document.createElement('div');
    this._mountNode.style['z-index'] = '9999';
    document.body.appendChild(this._mountNode);
    ReactDOM.render(this._overlay, this._mountNode);
  }

  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this._mountNode);
    this._mountNode = null;
  }

  componentDidUpdate () {
    if (this._mountNode) {
      ReactDOM.render(this._overlay, this._mountNode);
    }
  }

  render () {
    const {componentModel: {tasks}} = this.props;
    const tasksCount = tasks.size;
    if (tasksCount > 0) {

      const itemStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#ffffff',
        borderRadius: '5px',
        padding: '0.7em'
      };
      let tasksList = [];
      tasks.forEach((value, key) => {
        tasksList.push(
          <h5 key={key} style={itemStyle}>
            <i className="fa fa-spinner fa-pulse"/>
            <span style={{marginLeft: '0.5em'}}>{key}</span>
          </h5>
        );
      });
      this._overlay = (
        <div style={{position: 'fixed', top: '0px', left: '0px', right: '0px', bottom: '0px', zIndex: '9999'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
            <div style={{display: 'block'}}>
              {tasksList}
            </div>
          </div>
        </div>
      );
    } else {
      this._overlay = (
        <span />
      );
    }
    return (
      <span />
    );
  }

}

export default connect(modelSelector, containerActions)(Container);
