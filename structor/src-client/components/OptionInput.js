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

import { isObject, isString, isNumber, isBoolean, get, set, debounce } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OptionInput extends Component {

  constructor (props) {

    super(props);

    let valueType = 'text';
    if (props.valueObject && isObject(props.valueObject)) {
      var value = get(props.valueObject, props.path);
      valueType = this.getTypeOfProperty(value);
    }
    let label = props.path.replace('.', ' / ');
    this.state = {
      valueObject: props.valueObject,
      label: label,
      propertyType: valueType
    };

    this.handleChangeInputValue = this.handleChangeInputValue.bind(this);
    this.handleChangeCheckboxValue = this.handleChangeCheckboxValue.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {valueObject, path} = nextProps;
    let valueType = 'text';
    let value;
    if (valueObject && isObject(valueObject)) {
      value = get(valueObject, path);
      valueType = this.getTypeOfProperty(value);
    }
    let label = path.replace('.', ' / ');
    this.setState({
      valueObject: valueObject,
      label: label,
      propertyType: valueType
    });
  }

  componentWillMount () {
    this.delayedChangeInputValue = debounce((e) => {
      if (this.props.onChangeValue) {
        this.props.onChangeValue(this.state.valueObject);
      }
    }, 1000);
  }

  componentWillUnmount () {
    this.delayedChangeInputValue.cancel;
  }

  getValueFromObject () {
    return get(this.state.valueObject, this.props.path);
  }

  handleChangeInputValue (e) {
    let value = null;
    const {propertyType} = this.state;
    if (propertyType) {
      if (propertyType === 'text') {
        value = this.inputElement.value;
      } else if (propertyType === 'checkbox') {
        value = this.inputElement.checked;
      } else if (propertyType === 'number') {
        value = parseFloat(this.inputElement.value);
      }
    }
    let valueObject = set({}, this.props.path, value);
    this.setState({
      valueObject: valueObject
    });
    e.persist();
    this.delayedChangeInputValue(e);
  }

  handleChangeCheckboxValue (e) {
    let value = null;
    const {propertyType} = this.state;
    const {path, onChangeValue} = this.props;
    if (propertyType) {
      if (propertyType === 'checkbox') {
        value = this.inputElement.checked;
      }
    }
    let valueObject = set({}, path, value);
    this.setState({
      valueObject: valueObject
    });
    if (onChangeValue) {
      onChangeValue(valueObject);
    }
  }

  handleDelete (e) {
    if (this.props.onDeleteValue) {
      this.props.onDeleteValue(this.props.path);
    }
  }

  handleFocus () {
    if (this.props.onSetFocus) {
      this.props.onSetFocus(this.props.path);
    }
  }

  getTypeOfProperty (propertyValue) {
    if (isString(propertyValue)) {
      return 'text';
    } else if (isNumber(propertyValue)) {
      return 'number';
    } else if (isBoolean(propertyValue)) {
      return 'checkbox';
    }
  }

  render () {
    const {propertyType, label} = this.state;
    let element = null;
    let style = {
      height: '1.55em', paddingTop: '2px', paddingBottom: '2px'
    };
    if (propertyType === 'checkbox') {
      style.width = '2em';
      element = (
        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
          <div style={{flexGrow: 0, width: '1em'}}>
                        <span
                          style={{cursor: 'pointer'}}
                          className="fa fa-trash-o"
                          onClick={this.handleDelete}
                        />
          </div>
          <div style={{flexGrow: 2}}>
            <input
              ref={me => this.inputElement = me}
              type={propertyType}
              checked={this.getValueFromObject()}
              onFocus={this.handleFocus}
              style={style}
              onChange={this.handleChangeCheckboxValue}
            />
          </div>
        </div>
      );

    } else if (propertyType === 'text' || propertyType === 'number') {
      element = (
        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
          <div style={{flexGrow: 0, width: '1em'}}>
                        <span
                          style={{cursor: 'pointer'}}
                          className="fa fa-trash-o"
                          onClick={this.handleDelete}
                        />
          </div>
          <div style={{flexGrow: 2}}>
            <input
              ref={me => this.inputElement = me}
              type={propertyType}
              className="form-control"
              value={this.getValueFromObject()}
              style={style}
              onFocus={this.handleFocus}
              onChange={this.handleChangeInputValue}
            />
          </div>
        </div>
      );
    }
    return (
      <div style={this.props.style}>
        <p style={{marginBottom: '3px', paddingLeft: '1em'}}>
          <strong>{label}</strong>
        </p>
        {element}
      </div>
    );
  }

}

OptionInput.propTypes = {
  valueObject: PropTypes.any,
  label: PropTypes.string
};

OptionInput.defaultProps = {
  valueObject: null,
  label: 'Option:'
};

export default OptionInput;