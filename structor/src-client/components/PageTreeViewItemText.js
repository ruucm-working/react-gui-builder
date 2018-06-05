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
import ContentEditable from './ContentEditable.js';

class PageTreeViewItemText extends Component {

  constructor (props) {
    super(props);
    this.state = {
      textValue: this.props.textValue,
      isEditable: false
    };
    this.handleTextClick = this.handleTextClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleTextClick (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelect) {
      this.props.onSelect(this.props.itemKey);
    }
    this.setState({
      isEditable: true
    });
  }

  handleBlur (e) {
    this.props.onChangeText(e.target.value, this.props.itemKey);
    this.setState({
      isEditable: false
    });
  }

  handleChange (e) {
    this.setState({
      textValue: e.target.value
    });
  }

  componentDidMount () {
    if (this.state.isEditable === true) {
      $(this.refs.textItemElement).focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      textValue: nextProps.textValue
    });
  }

  render () {
    let content = null;
    if (this.state.isEditable === true) {
      content = (
        <div
          ref="textItemElement"
          className='text-danger'
          style={{position: 'relative', fontWeight: '200'}}>
          {this.props.textValue}
          <ContentEditable
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            html={this.state.textValue}
          />
        </div>
      );
    } else {
      content = (
        <div
          ref="textItemElement"
          className='text-danger'
          style={{position: 'relative', fontWeight: '200'}}
          onClick={this.handleTextClick}
        >
          {this.props.textValue ? this.props.textValue : <small>empty</small>}
        </div>
      );
    }
    return (
      <div style={{marginLeft: '1em', width: 'calc(100% - 1em)'}}>
        {content}
      </div>
    );
  }

}

PageTreeViewItemText.defaultProps = {
  itemKey: undefined,
  textValue: '',
  onChangeText: undefined,
  onSelect: undefined
};
PageTreeViewItemText.propTypes = {
  itemKey: PropTypes.string.isRequired,
  textValue: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSelect: PropTypes.func
};

export default PageTreeViewItemText;


