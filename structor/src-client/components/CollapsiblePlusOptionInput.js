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
import { Collapse, Panel } from 'react-bootstrap';

class CollapsiblePlusOptionInput extends Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  handleToggle (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onToggle) {
      this.props.onToggle();
    }
    this.setState({open: !this.state.open});
  }

  handleCommit (e) {
    e.preventDefault();
    e.stopPropagation();
    this.handleToggle(e);
    if (this.props.onCommit) {
      this.props.onCommit({
        path: this.refs.inputPath.value,
        value: this.refs.inputValue.value
      });
    }
  }

  handleOnKeyDown (e) {
    if (e.keyCode == 27) {
      this.handleToggle(e);
    }
  }

  render () {

    let options = [];
    const {optionNames} = this.props;
    if (optionNames && optionNames.length > 0) {
      optionNames.forEach((optionName, index) => {
        options.push(
          <option key={optionName + index}>{optionName}</option>
        );
      });
    }

    return (
      <div style={this.props.style}>
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
          <button role="button"
                  style={{margin: '0 1em'}}
                  className="btn btn-default btn-xs"
                  onClick={this.handleToggle}>
            <span className="fa fa-plus"></span>
            <span>&nbsp;Add property</span>
          </button>
        </div>

        <Collapse in={this.state.open} onEntered={() => {this.refs.inputPath.focus();}}>
          <div style={{position: 'relative'}}>
            <form onSubmit={this.handleCommit}>
              <Panel>
                <label>Property path</label>
                <input ref="inputPath"
                       placeholder="prop[.prop]"
                       type="text"
                       autoComplete="on"
                       list="options"
                       className="form-control"
                       onKeyDown={this.handleOnKeyDown}/>
                <label style={{marginTop: '5px'}}>Property value</label>
                <input ref="inputValue"
                       type="text"
                       className="form-control"
                       onKeyDown={this.handleOnKeyDown}/>
                <button
                  role="button"
                  type="submit"
                  className="btn btn-default btn-xs btn-block"
                  style={{marginTop: '10px'}}>
                  <span>Add</span>
                </button>
              </Panel>
              <datalist id="options">
                {options}
              </datalist>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }

}

CollapsiblePlusOptionInput.defaultProps = {
  onToggle: null
};

export default CollapsiblePlusOptionInput;


