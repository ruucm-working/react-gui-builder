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
import { uniqueId } from 'lodash';
import { Panel } from 'react-bootstrap';

class PageComponentForm extends Component {

  constructor (props) {
    super(props);
    this.state = {
      pagePath: this.props.pagePath,
      pageTitle: this.props.pageTitle
    };
    this.validatePagePath = this.validatePagePath.bind(this);
    this.handlePagePathChange = this.handlePagePathChange.bind(this);
  }

  getOptions () {
    return {
      pageName: uniqueId('Page'),
      pagePath: this.state.pagePath,
      pageTitle: this.state.pageTitle,
      makeIndexRoute: this.refs.pageIndexCheckbox.checked
    };
  }

  validatePagePath () {
    const {pagePath} = this.state;
    if (pagePath && pagePath.length > 0 && pagePath.charAt(0) === '/') {
      return 'has-success';
    } else {
      return 'has-error';
    }
  }

  handlePagePathChange () {
    this.setState({
      pagePath: this.refs.pagePathInput.value
    });
  }

  render () {
    return (
      <table style={{width: '100%'}}>
        <tbody>
        <tr>
          <td style={{width: '1em'}}/>
          <td style={{height: '100%', verticalAlign: 'top'}}>
            <div className={'form-group ' + this.validatePagePath()}>
              <label htmlFor='pagePathElement'>Route path:</label>
              <input
                id='pagePathElement'
                ref='pagePathInput'
                className="form-control input-sm"
                type="text"
                placeholder='Path'
                value={this.state.pagePath}
                onChange={this.handlePagePathChange}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor='pageIndexCheckbox'>
                <input
                  id='pageIndexCheckbox'
                  ref='pageIndexCheckbox'
                  style={{display: 'inline-block'}}
                  type="checkbox"
                />
                <span>&nbsp;&nbsp;make index route</span>
              </label>
            </div>
          </td>
          <td style={{width: '1em'}}/>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default PageComponentForm;
