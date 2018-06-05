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
import { MenuItem } from 'react-bootstrap';

const MENU_WIDTH = 150;
const MENU_HEIGHT = 200;

class MouseMenuOverlay extends Component {

  constructor (props) {
    super(props);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleCut = this.handleCut.bind(this);
    this.handleReplace = this.handleReplace.bind(this);
    this.handleBefore = this.handleBefore.bind(this);
    this.handleFirst = this.handleFirst.bind(this);
    this.handleAfter = this.handleAfter.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
    const {pointX, pointY, showMenu} = this.props;
    return nextProps.pointX !== pointX || nextProps.pointY !== pointY || nextProps.showMenu !== showMenu;
  }

  handleCopy (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('copy', itemKey);
  }

  handleCut (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('cut', itemKey);
  }

  handleReplace (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('replace', itemKey);
  }

  handleBefore (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('before', itemKey);
  }

  handleFirst (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('first', itemKey);
  }

  handleAfter (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('after', itemKey);
  }

  handleDelete (e) {
    e.stopPropagation();
    e.preventDefault();
    const {itemKey, onMenuItemClick} = this.props;
    onMenuItemClick('delete', itemKey);
  }

  render () {
    const {showMenu, pointX, pointY, panel} = this.props;
    if (!showMenu) {
      return null;
    }
    const $panel = $(panel);
    const x = pointX - $panel.offset().left + panel.scrollLeft;
    const y = pointY - $panel.offset().top + panel.scrollTop;
    const clientWidth = panel.clientWidth;
    const clientHeight = panel.clientHeight;
    const widthDelta = clientWidth - x;
    const heightDelta = clientHeight - y;
    let top = y;
    let left = x;
    if (widthDelta < MENU_WIDTH) {
      left -= MENU_WIDTH;
    }
    if (y - panel.scrollTop > MENU_HEIGHT &&heightDelta < MENU_HEIGHT) {
      top -= MENU_HEIGHT;
    }
    return (
      <div
        className="mouse-center-point"
        style={{top, left, zIndex: 1045}}
      >
        <ul className="dropdown-menu open" style={{width: '150px', display: 'block'}}>
          <MenuItem onMouseDown={this.handleCopy}>Copy</MenuItem>
          <MenuItem onMouseDown={this.handleCut}>Cut</MenuItem>
          <MenuItem divider />
          <MenuItem onMouseDown={this.handleReplace}>Replace</MenuItem>
          <MenuItem divider />
          <MenuItem onMouseDown={this.handleBefore}>Add Before</MenuItem>
          <MenuItem onMouseDown={this.handleFirst}>Insert First</MenuItem>
          <MenuItem onMouseDown={this.handleAfter}>Add After</MenuItem>
          <MenuItem divider/>
          <MenuItem onMouseDown={this.handleDelete}>Delete</MenuItem>
        </ul>
      </div>
    );
  }
}

export default MouseMenuOverlay;
