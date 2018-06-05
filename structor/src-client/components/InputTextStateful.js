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

class InputTextStateful extends Component {

  constructor (props, content) {
    super(props, content);
    this.state = {
      value: this.props.value || this.props.defaultValue || ''
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  handleOnChange () {
    this.setState({
      value: this.inputElement.value
    });
  }

  getValue () {
    return this.state.value;
  }

  focus () {
    this.inputElement.focus();
  }

  validate (value) {
    const {validateFunc} = this.props;
    if (validateFunc) {
      return validateFunc(value) ? 'has-success' : 'has-error';
    }
  }

  render () {
    const {value} = this.state;
    return (
      <div className={'form-group ' + this.validate(value)}>
        <input
          style={this.props.style}
          type={this.props.type}
          ref={me => this.inputElement = me}
          className="form-control"
          value={ value }
          disabled={this.props.disabled}
          list={this.props.list}
          autoComplete={this.props.autoComplete}
          placeholder={this.props.placeholder}
          onChange={ this.handleOnChange }
        />
      </div>
    );
  }
}
InputTextStateful.defaultProps = {
  defaultValue: undefined,
  value: undefined,
  validateFunc: undefined,
  type: 'text',
  disabled: false,
};
InputTextStateful.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  validateFunc: PropTypes.func,
  type: PropTypes.string,
  list: PropTypes.string,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputTextStateful;
