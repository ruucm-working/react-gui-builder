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

import { Modal, Button, Alert } from 'react-bootstrap';
import { DirPathInput } from 'components';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {error: ''};
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      this.dirPathInput.focus();
    }
  }

  handleCancel (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {hideModal} = this.props;
    hideModal();
    this.clearError();
  }

  handleSubmit (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const dirPath = this.dirPathInput.getValue();
    if (dirPath && dirPath.length > 0) {
      const {submitModal} = this.props;
      submitModal(dirPath);
      this.clearError();
    } else {
      this.setState({error: 'Directory path should not be empty'});
    }
  }

  clearError () {
    this.setState({error: ''});
  }

  render () {
    const {show, dirPath, recentDirPaths} = this.props;
    const {error} = this.state;
    return (
      <Modal
        show={show}
        onHide={this.handleCancel}
        dialogClassName="umy-modal-overlay"
        backdrop={true}
        keyboard={true}
        bsSize="large"
        ref="dialog"
        animation={true}
      >
        <Modal.Header
          closeButton={false}
          aria-labelledby='contained-modal-title'
        >
          <Modal.Title id='contained-modal-title'>Directory Path</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error &&
          <Alert bsStyle="danger">{error}</Alert>
          }
          <DirPathInput
            ref={me => this.dirPathInput = me}
            dirPath={dirPath}
            label="Namespaces package directory path"
            isAutoComplete={true}
            options={recentDirPaths}
            onEnterKey={this.handleSubmit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button onClick={this.handleSubmit} bsStyle="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

