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

import marked from 'marked';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Modal, Button } from 'react-bootstrap';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
  }

  handleCancel (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {componentModel: {cancel}, hideModal} = this.props;
    if (cancel) {
      cancel();
    }
    hideModal();
  }

  handleAccept (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {componentModel: {accept}, hideModal} = this.props;
    if (accept) {
      accept();
    }
    hideModal();
  }

  render () {
    const {componentModel: {show, message}} = this.props;
    return (
      <Modal
        show={show}
        onHide={this.handleCancel}
        dialogClassName="umy-modal-overlay umy-modal-middlesize"
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
          <Modal.Title id='contained-modal-title'>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{padding: '1em'}}>
            {message &&
            <div dangerouslySetInnerHTML={{__html: marked(message)}}/>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button onClick={this.handleAccept} bsStyle="primary">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

