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

import { includes, findIndex, difference } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col } from 'react-bootstrap';
import { DirPathInput } from 'components';

const labelContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0.5em',
};

const firstCellStyle = {
  whiteSpace: 'wrap',
  flexGrow: 2,
};

const secondCellStyle = {
  marginLeft: '0.5em',
  flexGrow: 0,
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleExtract = this.handleExtract.bind(this);
  }

  handleExtract (e) {
    e.stopPropagation();
    e.preventDefault();
    const {dependentNamespaces, dependencies, selectedPages, extract} = this.props;
    extract(dependentNamespaces, dependencies, selectedPages, this.dirPathInput.getValue());
  }

  render () {
    const {dependentNamespaces, dependencies, selectedNamespaces, recentDirPaths} = this.props;
    let addedNamespaces = difference(dependentNamespaces, selectedNamespaces);
    const {packages} = dependencies ? dependencies : null;
    return (
      <Grid fluid={ true }>
        <Row style={{position: 'relative'}}>
          <Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
            <div className="alert alert-info" role="alert">
              <DirPathInput
                ref={me => this.dirPathInput = me}
                dirPath={recentDirPaths[0]}
                label="The source code of the listed namespaces will be saved into the directory:"
                isAutoComplete={true}
                options={recentDirPaths}
                onEnterKey={() => {}}
              />
            </div>
          </Col>
        </Row>
        <Row style={{minHeight: '40em', position: 'relative'}}>
          <Col xs={ 6 } md={ 4 } sm={ 6 } lg={ 4 } mdOffset={2} lgOffset={2}>
            <div>

              <div className="panel panel-primary">
                <div className="panel-heading">Selected namespaces:</div>
                <div className="panel-body">
                  {selectedNamespaces.map((item, index) => {
                    return (
                      <div
                        key={item + index}
                        style={labelContainerStyle}
                      >
                        <div style={firstCellStyle}>
                          <strong>{item}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {addedNamespaces && addedNamespaces.length > 0 &&
              <div className="panel panel-warning">
                <div className="panel-heading">Linked namespaces:</div>
                <div className="panel-body">
                  {addedNamespaces.map((item, index) => {
                    return (
                      <div
                        key={item + index}
                        style={labelContainerStyle}
                      >
                        <div style={firstCellStyle}>
                          <strong>{item}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              }
            </div>
            <div style={{marginTop: '2em', display: 'flex', justifyContent: 'center'}}>
              <button
                className="btn btn-primary"
                onClick={this.handleExtract}
              >
                Extract namespaces
              </button>
            </div>
          </Col>
          <Col xs={ 6 } md={ 4 } sm={ 6 } lg={ 4 }>
            <div className="panel panel-default">
              <div className="panel-heading">Node modules dependency:</div>
              <div className="panel-body">
                {packages && packages.length > 0 && packages.map((item, index) => {
                  return (
                    <div
                      key={item.name + index}
                      style={labelContainerStyle}
                    >
                      <div style={firstCellStyle}>
                        <strong>{item.name}</strong>
                      </div>
                      <div style={secondCellStyle}>
                        <span>{'Version: ' + item.version}</span>
                      </div>
                    </div>
                  );
                })}
                {(!packages || packages.length <= 0) &&
                <h4>None</h4>
                }
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(modelSelector, containerActions)(Container);

