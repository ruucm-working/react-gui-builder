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
import { forOwn, isObject, isNumber, isString, isBoolean } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MetaOptionsInput from './MetaOptionInput';

class MetaOptionsContainer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      optionsObject: Object.assign({}, this.props.optionsObject)
    };
  }

  getOptionsObject () {
    const {optionsObject} = this.state;
    const {optionsObject: originalObject} = this.props;
    let resultObject = {};
    forOwn(optionsObject, (value, prop) => {
      if (isString(value)) {
        resultObject[prop] = value && value.length > 0 ? value : originalObject[prop];
      } else if (isNumber(value)) {
        resultObject[prop] = value && isFinite(value) ? value : originalObject[prop];
      } else if (isBoolean(value)) {
        resultObject[prop] = value !== undefined ? value : originalObject[prop];
      }
    });
    return resultObject;
  }

  handleChangeValue = (prop) => (value) => {
    let newObject = Object.assign({}, this.state.optionsObject);
    newObject[prop] = value;
    this.setState({optionsObject: newObject});
  };

  render () {
    const {optionsObject} = this.state;
    const {optionsHelpObject} = this.props;
    let optionsList = [];
    forOwn(optionsObject, (value, prop) => {
      if (!isObject(value)) {
        optionsList.push(
          <MetaOptionsInput
            key={'' + prop}
            value={value}
            help={optionsHelpObject[prop]}
            onChangeValue={this.handleChangeValue(prop)}
            style={{marginBottom: '1em'}}/>
        );
      }
    });
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          {optionsList}
        </div>
      </div>
    );
  }
}

MetaOptionsContainer.propTypes = {
  optionsObject: PropTypes.any.isRequired,
  optionsHelpObject: PropTypes.any,
};

MetaOptionsContainer.defaultProps = {
  optionObject: null,
  optionsHelpObject: {},
};

export default MetaOptionsContainer;
