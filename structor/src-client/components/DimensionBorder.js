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

class DimensionBorder extends Component {

  constructor (props) {
    super(props);
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
  }

  handleIncrease (e) {
    e.stopPropagation();
    e.preventDefault();
    const {onIncrease, type} = this.props;
    if (onIncrease) {
      onIncrease(type);
    }
  }

  handleDecrease (e) {
    e.stopPropagation();
    e.preventDefault();
    const {onDecrease, type} = this.props;
    if (onDecrease) {
      onDecrease(type);
    }
  }

  render () {
    const {type, buttonDistance} = this.props;
    const distance = buttonDistance + 'px';
    let className;
    let increaseButtonStyle = {};
    let decreaseButtonStyle = {};
    if (type === 'left') {
      className = 'dimension-border-left';
      increaseButtonStyle = {top: distance, left: '2px'};
      decreaseButtonStyle = {bottom: distance, left: '2px'};
    } else if (type === 'right') {
      className = 'dimension-border-right';
      increaseButtonStyle = {top: distance, right: '2px'};
      decreaseButtonStyle = {bottom: distance, right: '2px'};
    } else if (type === 'top') {
      className = 'dimension-border-top';
      increaseButtonStyle = {left: distance, top: '2px'};
      decreaseButtonStyle = {right: distance, top: '2px'};
    } else if (type === 'bottom') {
      className = 'dimension-border-bottom';
      increaseButtonStyle = {left: distance, bottom: '2px'};
      decreaseButtonStyle = {right: distance, bottom: '2px'};
    }
    return (
      <div className={className}>
        <div style={increaseButtonStyle}
             className="dimension-btn"
             onClick={this.handleIncrease}>
          <div className="dimension-btn-inner">
            <i className='fa fa-plus'/>
          </div>
        </div>
        <div style={decreaseButtonStyle}
             className='dimension-btn'
             onClick={this.handleDecrease}>
          <div className="dimension-btn-inner">
            <i className='fa fa-minus'/>
          </div>
        </div>
      </div>
    );
  }
}

DimensionBorder.propTypes = {
  type: PropTypes.string.isRequired,
  buttonDistance: PropTypes.number.isRequired,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};

DimensionBorder.defaultProps = {
  type: 'left',
  buttonDistance: 30,
};

export default DimensionBorder;
