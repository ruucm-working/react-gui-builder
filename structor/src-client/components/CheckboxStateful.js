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

class CheckboxStateful extends Component {

  constructor (props, content) {
    super(props, content);
    this.state = {
      value: this.props.value
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  handleOnChange () {
    this.setState({
      value: this.refs.inputElement.checked
    });
  }

  getValue () {
    return this.state.value;
  }

  render () {
    const {value} = this.state;
    return (
      <input
        style={this.props.style}
        ref="inputElement"
        type="checkbox"
        checked={value}
        onChange={ this.handleOnChange }/>
    );
  }
}
CheckboxStateful.defaultProps = {
  value: false
};
CheckboxStateful.propTypes = {
  value: PropTypes.bool
};

export default CheckboxStateful;
