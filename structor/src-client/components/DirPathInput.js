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

class DirPathInput extends Component {

  constructor (props) {
    super(props);
    this.state = {
      dirPathValue: this.props.dirPath || ''
    };
    this.handleClearValue = this.handleClearValue.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({dirPathValue: nextProps.dirPath});
  }

  getValue () {
    return this.state.dirPathValue;
  }

  focus () {
    this.inputElement.focus();
  }

  handleClearValue (e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      dirPathValue: ''
    });
  }

  handleChangeValue (e) {
    this.setState({
      dirPathValue: this.inputElement.value
    });
  }

  handleOnKeyDown (e) {
    if (e.keyCode == 13) {
      const {onEnterKey} = this.props;
      if (onEnterKey) {
        onEnterKey();
      }
    }
  }

  render () {
    const {label, isAutoComplete, options} = this.props;
    const {dirPathValue} = this.state;
    let dirsDataOptions = [];
    if (options && options.length > 0) {
      options.forEach((name, index) => {
        dirsDataOptions.push(
          <option key={'' + index}>{name}</option>
        );
      });
    }
    return (
      <div>
        <label htmlFor="inputElement">{label}</label>
        <div className="input-group">
          <span className="input-group-addon">
              Path:
          </span>
          <input
            ref={me => this.inputElement = me}
            value={dirPathValue || ''}
            type="text"
            className="form-control"
            placeholder="Enter directory path"
            onChange={this.handleChangeValue}
            list="dirPathInputOptions"
            autoComplete={isAutoComplete}
            onKeyDown={this.handleOnKeyDown}
          />
          {isAutoComplete && dirsDataOptions.length > 0 &&
          <datalist id="dirPathInputOptions">
            {dirsDataOptions}
          </datalist>
          }
          <span className="input-group-btn">
                        <button
                          className="btn btn-default"
                          onClick={this.handleClearValue}>
                            <span className="fa fa-times"/>
                        </button>
                    </span>
        </div>
      </div>
    );
  }

}

DirPathInput.propTypes = {
  dirPath: PropTypes.string,
  label: PropTypes.string,
  isAutoComplete: PropTypes.bool,
  options: PropTypes.array,
  onEnterKey: PropTypes.func,
};

DirPathInput.defaultProps = {
  dirPath: null,
  label: 'Proxy URL:',
  isAutoComplete: false,
  options: [],
  onEnterKey: null,
};

export default DirPathInput;
