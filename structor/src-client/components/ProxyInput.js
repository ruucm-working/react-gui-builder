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
import PropTypes from 'prop-types';

class ProxyInput extends Component {

  constructor (props) {
    super(props);
    this.state = {
      urlValue: this.props.urlValue || ''
    };
    this.handleClearUrlValue = this.handleClearUrlValue.bind(this);
    this.handleChangeUrlValue = this.handleChangeUrlValue.bind(this);
  }

  getUrlValue () {
    return this.inputElement.value;
  }

  handleClearUrlValue (e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      urlValue: ''
    });
  }

  handleChangeUrlValue (e) {
    this.setState({
      urlValue: this.inputElement.value
    });
  }

  render () {
    return (
      <div>
        <label htmlFor="inputElement">{this.props.label}</label>
        <div className="input-group">
                    <span className="input-group-addon">
                        URL:
                    </span>
          <input
            ref={me => this.inputElement = me}
            value={this.state.urlValue}
            type="text"
            className="form-control"
            placeholder="Enter value"
            onChange={this.handleChangeUrlValue}
          >
          </input>
          <span className="input-group-btn">
                        <button
                          className="btn btn-default"
                          onClick={this.handleClearUrlValue}>
                            <span className="fa fa-times"/>
                        </button>
                    </span>
        </div>
      </div>
    );
  }

}

ProxyInput.propTypes = {
  urlValue: PropTypes.string,
  label: PropTypes.string
};

ProxyInput.defaultProps = {
  urlValue: null,
  label: 'Proxy URL:'
};

export default ProxyInput;
