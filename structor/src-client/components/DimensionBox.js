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
import DimensionBorder from './DimensionBorder.js';

class DimensionBox extends Component {

  constructor (props) {
    super(props);
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
  }

  handleDecrease (border) {
    const {onDecrease, type} = this.props;
    if (onDecrease) {
      onDecrease(type, border);
    }
  }

  handleIncrease (border) {
    const {onIncrease, type} = this.props;
    if (onIncrease) {
      onIncrease(type, border);
    }
  }

  render () {
    const {type} = this.props;
    let buttonDistance = 20;
    let className = 'dimension-box';
    if (type === 'padding') {
      className += ' dimension-padding';
      buttonDistance = 20;
    } else if (type === 'border') {
      className += ' dimension-border';
      buttonDistance = 30;
    } else if (type === 'margin') {
      className += ' dimension-margin';
      buttonDistance = 30;
    } else if (type === 'position') {
      className += ' dimension-position';
      buttonDistance = 30;
    }
    return (
      <div className={className}>
        <DimensionBorder
          type="left"
          buttonDistance={buttonDistance}
          onDecrease={this.handleDecrease}
          onIncrease={this.handleIncrease}/>
        <DimensionBorder
          type="top"
          buttonDistance={buttonDistance}
          onDecrease={this.handleDecrease}
          onIncrease={this.handleIncrease}/>
        <DimensionBorder
          type="right"
          buttonDistance={buttonDistance}
          onDecrease={this.handleDecrease}
          onIncrease={this.handleIncrease}/>
        <DimensionBorder
          type="bottom"
          buttonDistance={buttonDistance}
          onDecrease={this.handleDecrease}
          onIncrease={this.handleIncrease}/>
        {type === 'padding' ?
          <div style={{width: '40px', height: '40px', backgroundColor: '#fff', border: '1px solid #dcdcdc'}}
               className="dimension-center"/>
          : this.props.children
        }
      </div>
    );
  }
}

DimensionBox.propTypes = {
  type: PropTypes.string.isRequired,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};

DimensionBox.defaultProps = {
  type: 'padding',
  onDecrease: (dimension, border) => console.log(`Decrease ${dimension} on ${border}`),
  onIncrease: (dimension, border) => console.log(`Increase ${dimension} on ${border}`),
};

export default DimensionBox;
