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

import { isObject, get, set, startCase } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getStateObject = (valueObject, path) => {
  let value;
  if (valueObject && isObject(valueObject)) {
    value = get(valueObject, path);
  }
  let label = path.split('.');
  if (label && label.length > 1) {
    label = startCase(label[1]);
  } else {
    label = path.replace('.', ' / ');
  }
  return {
    valueObject: valueObject,
    label: label,
    value: value,
  };
};

const rowContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  width: '100%',
  marginTop: '3px',
};

const checkBoxStyle = {margin: 0};
const labelStyle = {margin: '0px 0px 0px 3px'};

class StyleOptionSelect extends Component {

  constructor (props) {
    super(props);
    this.state = getStateObject(props.valueObject, props.path);
    this.handleToggleOption = this.handleToggleOption.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {valueObject, path} = nextProps;
    this.setState(getStateObject(valueObject, path));
  }

  handleToggleOption (e) {
    const {path, onSet} = this.props;
    const checked = e.currentTarget.checked;
    onSet(path, checked);
  }

  handleToggleFavorite (e) {
    e.stopPropagation();
    e.preventDefault();
    const {path, onToggleFavorite} = this.props;
    onToggleFavorite(path);
  }

  handleChangeValue (e) {
    const newValue = e.currentTarget.dataset.val;
    let valueObject = set({}, this.props.path, newValue);
    this.props.onChangeValue(valueObject);
  }

  render () {
    const {isSet, valueList, isFavorite} = this.props;
    const {label, value} = this.state;
    return (
      <div style={this.props.style}>
        <div style={rowContainerStyle}>
          <input
            type="checkbox"
            style={checkBoxStyle}
            checked={isSet}
            onChange={this.handleToggleOption}
          />
          <div style={{flexGrow: 1}}>
            <p style={labelStyle}>
              {isSet ? <strong>{label}</strong> : <span className="text-muted">{label}</span>}
            </p>
          </div>
          <div style={{flexGrow: 0}}>
            <i
              className={'fa text-muted ' + (isFavorite ? 'fa-heart' : 'fa-heart-o')}
              style={{cursor: 'pointer'}}
              title={isFavorite ? 'Remove from the favorites list' : 'Add to the favorites list'}
              onClick={this.handleToggleFavorite}
            />
          </div>
        </div>
        {isSet &&
        <div style={rowContainerStyle}>
          <div
            key="unitsButton"
            className="btn-group btn-block"
            role="group">
            <button
              className="btn btn-default btn-xs btn-block dropdown-toggle"
              data-toggle="dropdown">
              <span>{value}</span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-right"
              role="menu">
              {valueList.map((u, index) => {
                return (
                  <li key={u + index}>
                    <a
                      href="#"
                      data-val={u}
                      onClick={this.handleChangeValue}>
                      {u}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        }
      </div>
    );
  }
}

StyleOptionSelect.propTypes = {
  valueObject: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
  valueList: PropTypes.array.isRequired,
  isSet: PropTypes.bool.isRequired,
  onSet: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
};

StyleOptionSelect.defaultProps = {
  valueObject: null,
  path: 'style.width',
  valueList: ['option1', 'option2', 'option3'],
  isSet: false,
  onSet: (path, checked) => {
    console.log(path, checked);
  },
  onChangeValue: (valueObject) => {
    console.log(JSON.stringify(valueObject));
  },
};

export default StyleOptionSelect;