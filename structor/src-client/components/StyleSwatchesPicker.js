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

import { isString, isObject, get, set, startCase } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

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

const popover = {
  position: 'absolute',
  left: '-1em',
  top: '0em',
  height: '100px',
  zIndex: 5,
};

const container = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  marginTop: '6px',

};

const closeButton = {
  position: 'absolute',
  fontSize: '10px',
  fontWeight: 200,
  top: '-.7em',
  left: '-.7em',
  width: '2em',
  height: '2em',
  border: '1px solid #cdcdcd',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: '#fff',
  zIndex: 6,
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

class StyleSwatchesPicker extends Component {

  constructor (props) {
    super(props);
    this.state = getStateObject(props.valueObject, props.path);
    // this.state = {
    //     colorValueString: this.props.colorValueString || '#fff',
    //     displayColorPicker: false
    // };
    this.handleToggleOption = this.handleToggleOption.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  componentWillReceiveProps (nextProps) {
    const {valueObject, path} = nextProps;
    this.setState(getStateObject(valueObject, path));
  }

  handleClick (e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    });
  };

  handleClose (e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      displayColorPicker: false
    });
  };

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

  handleChangeComplete (color) {
    let colorValueString;
    const {hex, rgb} = color;
    if (rgb) {
      if (rgb.a === 1) {
        colorValueString = hex;
      } else {
        colorValueString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
      }
    }
    let valueObject = set({}, this.props.path, colorValueString);
    this.props.onChangeValue(valueObject);
  };

  render () {
    const {isSet, isFavorite} = this.props;
    const {displayColorPicker, label, value} = this.state;
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
        <div style={container}>
          <div
            style={{
              backgroundColor: value,
              border: '1px solid #cdcdcd',
              borderRadius: '50%',
              marginRight: '.5em',
              width: '1.5em',
              height: '1.5em',
              cursor: 'pointer'
            }}
            onClick={this.handleClick}
          />
          {displayColorPicker &&
          <div style={popover}>
            <div
              style={closeButton}
              onClick={this.handleClose}>
              <div>
                <i style={{margin: 0, padding: 0}} className="fa fa-times"/>
              </div>
            </div>
            <SketchPicker
              style={{height: '100px'}}
              color={value}
              onChangeComplete={this.handleChangeComplete}/>
          </div>
          }
          <div>
            <span>{value}</span>
          </div>
        </div>
        }
      </div>
    );
  }
}

StyleSwatchesPicker.propTypes = {
  valueObject: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
  isSet: PropTypes.bool.isRequired,
  onSet: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
};

StyleSwatchesPicker.defaultProps = {
  valueObject: null,
  path: 'style.color',
  isSet: false,
  onSet: (path, checked) => {
    console.log(path, checked);
  },
  onChangeValue: (valueObject) => {
    console.log(JSON.stringify(valueObject));
  },
};

export default StyleSwatchesPicker;
