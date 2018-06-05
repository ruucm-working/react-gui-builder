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
import { print } from 'api';

const linkStyle = {outline: 'none', color: '#2185D0'};
const propsStyle = {margin: '0 0 0 0.5em', fontWeight: '200', cursor: 'pointer'};
const namespaceStyle = {margin: '0 0 0 0.3em'};
const topTagWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};
const bottomTagWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

class PageTreeViewItem extends Component {

  constructor (props) {
    super(props);
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleMouseDownStartTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {onSelect, isSelected, itemKey, onShowMouseMenu, onHideMouseMenu} = this.props;
    if (e.button === 0) {
      if (onSelect) {
        onSelect(itemKey, e.metaKey || e.ctrlKey);
      }
      onHideMouseMenu();
    } else if (e.button === 2) {
      if (onSelect && !isSelected) {
        onSelect(itemKey, e.metaKey || e.ctrlKey);
      }
      onShowMouseMenu(e, itemKey);
    } else {
      onHideMouseMenu();
    }
  };

  handleMouseDownEndTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {onSelect, itemKey, onHideMouseMenu} = this.props;
    if (e.button === 0) {
      if (onSelect) {
        onSelect(itemKey, e.metaKey || e.ctrlKey);
      }
      onHideMouseMenu();
    } else {
      onHideMouseMenu();
    }
  };

  render () {

    let content = null;

    const {
      isSelected,
      isForCutting,
      isForCopying,
      itemKey,
      children,
      type,
      namespace,
      modelProps,
      beforeNamePlaceholder
    } = this.props;
    const {onMouseEnter, onMouseLeave} = this.props;

    let className;
    if (isSelected) {
      className = 'umy-treeview-list-item-selected';
    } else if (isForCopying) {
      className = 'umy-treeview-list-item-for-copying';
    } else if (isForCutting) {
      className = 'umy-treeview-list-item-for-cutting';
    } else {
      className = 'umy-treeview-list-item';
    }

    const label = (<div>{type}</div>);
    const namespaceLabel = namespace ? (
      <div className="text-muted" style={namespaceStyle}>{'[' + namespace + ']'}</div>)
      : null;
    let props = print.printProps(modelProps);
    if (children && children.length > 0) {
      content = (
        <li
          id={itemKey}
          className={className}
        >
          <div style={topTagWrapperStyle}>
            <div>{'<'}</div>
            {beforeNamePlaceholder}
            <a key={'toplink'}
               href="#"
               onClick={this.handleClick}
               onMouseDown={this.handleMouseDownStartTag}
               style={linkStyle}
               data-key={itemKey}
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
            >
              <div style={topTagWrapperStyle}>
                {label}
                {namespaceLabel}
              </div>
            </a>
            { props &&
            <div
              className="text-muted"
              onMouseDown={this.handleMouseDownStartTag}
              style={propsStyle}
            >
              <span>{props}</span>
            </div>
            }
            <div>{'>'}</div>
          </div>
          {children}
          <div style={bottomTagWrapperStyle}>
            <div>{'</'}</div>
            {beforeNamePlaceholder}
            <a key={'bottomlink'}
               href="#"
               onClick={this.handleClick}
               onMouseDown={this.handleMouseDownEndTag}
               style={linkStyle}
               data-key={itemKey}
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
            >
              {label}
            </a>
            <div>{'>'}</div>
          </div>
        </li>
      );
    } else {
      content = (
        <li
          id={itemKey}
          className={className}
        >
          <div style={topTagWrapperStyle}>
            <div>{'<'}</div>
            {beforeNamePlaceholder}
            <a href="#"
               onClick={this.handleClick}
               onMouseDown={this.handleMouseDownStartTag}
               style={linkStyle}
               data-key={itemKey}
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
            >
              <div style={topTagWrapperStyle}>
                {label}
                {namespaceLabel}
              </div>
            </a>
            { props &&
            <div
              className="text-muted"
              onClick={this.handleClick}
              onMouseDown={this.handleMouseDownStartTag}
              style={propsStyle}>
              {props}
            </div>
            }
            <div>{' />'}</div>
          </div>
        </li>
      );
    }

    return content;
  }
}

PageTreeViewItem.defaultProps = {
  itemKey: undefined,
  isSelected: false,
  onSelect: undefined,
  type: undefined,
  namespace: undefined
};
PageTreeViewItem.propTypes = {
  itemKey: PropTypes.string.isRequired,
  inSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  type: PropTypes.string.isRequired,
  namespace: PropTypes.string
};

export default PageTreeViewItem;

