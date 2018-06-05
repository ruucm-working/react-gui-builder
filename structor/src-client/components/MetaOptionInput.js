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

import { isObject, isString, isNumber, isBoolean, get, set, debounce, find } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getTypeOfProperty = (propertyValue) => {
  if (isString(propertyValue)) {
    return 'text';
  } else if (isNumber(propertyValue)) {
    return 'number';
  } else if (isBoolean(propertyValue)) {
    return 'checkbox';
  }
};

class MetaOptionInput extends Component {

  constructor (props) {

    super(props);
    this.state = {
      value: this.props.value,
      propertyType: getTypeOfProperty(this.props.value),
    };
    this.handleChangeInputValue = this.handleChangeInputValue.bind(this);
    this.handleChangeCheckboxValue = this.handleChangeCheckboxValue.bind(this);
    this.handleChangeOptionValue = this.handleChangeOptionValue.bind(this);
  }

  componentWillMount () {
    this.delayedChangeInputValue = debounce((value) => {
      if (this.props.onChangeValue) {
        this.props.onChangeValue(value);
      }
    }, 500);
  }

  componentWillUnmount () {
    this.delayedChangeInputValue.cancel;
  }

  handleChangeInputValue (e) {
    let value = null;
    const {propertyType} = this.state;
    const {inputElement} = this.refs;
    if (propertyType) {
      if (propertyType === 'text') {
        value = inputElement.value;
      } else if (propertyType === 'number') {
        value = parseFloat(inputElement.value);
      }
    }
    this.setState({
      value: value
    });
    e.persist();
    this.delayedChangeInputValue(value);
  }

  handleChangeOptionValue (e) {
    e.stopPropagation();
    e.preventDefault();
    let value = null;
    const {propertyType} = this.state;
    const {onChangeValue} = this.props;
    const newValue = e.currentTarget.dataset.val;
    if (propertyType) {
      if (propertyType === 'text') {
        value = newValue;
      } else if (propertyType === 'number') {
        value = parseFloat(newValue);
      }
    }
    this.setState({
      value: value
    });
    if (onChangeValue) {
      onChangeValue(value);
    }
  }

  handleChangeCheckboxValue (e) {
    let value = this.refs.inputElement.checked;
    const {onChangeValue} = this.props;
    this.setState({
      value: value
    });
    if (onChangeValue) {
      onChangeValue(value);
    }
  }

  render () {
    const {value, propertyType} = this.state;
    const {help: {description, options: helpOptions}} = this.props;
    let element = null;
    if (helpOptions && helpOptions.length > 0) {
      let valueLabel = helpOptions[0].label;
      let selectedOptionIndex = helpOptions.findIndex(i => i.value === value);
      if (selectedOptionIndex >= 0) {
        valueLabel = helpOptions[selectedOptionIndex].label;
      }
      element = (
        <div style={{position: 'relative'}}>
          <div>
            <label>{description}</label>
          </div>
          <div
            className="btn-group"
            role="group"
          >
            <button
              className="btn btn-default dropdown-toggle"
              data-toggle="dropdown">
              <span>{valueLabel}</span>
              <i className="fa fa-caret-down" style={{marginLeft: '0.5em'}}/>
            </button>
            <ul
              className="dropdown-menu"
              role="menu">
              {helpOptions.map((u, index) => {
                return (
                  <li key={u.label + index}>
                    <a
                      href="#"
                      data-val={u.value}
                      onClick={this.handleChangeOptionValue}>
                      {u.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else if (propertyType === 'checkbox') {
      element = (
        <div style={{position: 'relative'}}>
          <label>
            <input
              ref="inputElement"
              type={propertyType}
              checked={value}
              onChange={this.handleChangeCheckboxValue}
            />
            <span style={{marginLeft: '0.5em'}}>{description}</span>
          </label>
        </div>
      );

    } else if (propertyType === 'text' || propertyType === 'number') {
      element = (
        <div style={{position: 'relative'}}>
          <div>
            <label>{description}</label>
          </div>
          <input ref="inputElement"
                 type={propertyType}
                 className="form-control"
                 value={value}
                 onChange={this.handleChangeInputValue}/>
        </div>
      );
    }
    return (
      <div style={this.props.style}>
        {element}
      </div>
    );
  }

}

MetaOptionInput.propTypes = {
  value: PropTypes.any,
  help: PropTypes.any,
  onChangeValue: PropTypes.func.isRequired,
};

MetaOptionInput.defaultProps = {
  value: null,
  help: {},
  onChangeValue: (value) => {
    console.log(JSON.stringify(value));
  },
};

export default MetaOptionInput;