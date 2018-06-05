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
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { InputComponentAutocomplete } from 'components';

import { Modal, Button } from 'react-bootstrap';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      errors: []
    };
  }

  handleClose (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({
      errors: []
    });
    this.props.hideModal();
  }

  handleSubmit () {
    const {submit, componentModel: {appendMode, targetKey}, componentNames} = this.props;
    const tuple = this.input.getText();
    if (tuple) {
      const parts = tuple.split('.');
      if (parts && parts.length > 0) {
        let errors = [];
        parts.forEach(part => {
          if (componentNames.findIndex(i => i === part) < 0) {
            errors.push(`"${part}" component was not found`);
          }
        });
        if (errors.length > 0) {
          this.setState({
            errors: errors
          });
        } else {
          submit(tuple, appendMode, targetKey);
        }
      } else {
        this.setState({
          errors: ['Empty value is now allowed']
        });
      }
    } else {
      this.setState({
        errors: ['Empty value is now allowed']
      });
    }
  }

  render () {
    const {componentModel: {show, appendMode}, componentNames, hideModal} = this.props;
    const {errors} = this.state;
    return (
      <Modal
        show={show}
        onHide={hideModal}
        dialogClassName="umy-modal-overlay umy-modal-middlesize"
        backdrop={true}
        keyboard={false}
        bsSize="large"
        ref="dialog"
        animation={true}
      >
        <Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
          <Modal.Title id='contained-modal-title'>{appendMode.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors && errors.length > 0 &&
          <div style={{padding: '0px 1em'}}>
            {errors.map((e, index) => {
              return (
                <p
                  key={'error_' + index}
                  style={{margin: 0}} className="text-danger">
                  {e}
                </p>
              );
            })}
          </div>
          }
          <InputComponentAutocomplete
            ref={me => this.input = me}
            componentNames={componentNames}
            onSubmit={this.handleSubmit}
            onCancel={this.handleClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button onClick={this.handleSubmit} bsStyle="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(modelSelector, containerActions)(Container);

