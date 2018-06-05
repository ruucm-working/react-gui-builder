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
import { ProxyInput } from 'components';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {componentModel: {close}, hideModal} = this.props;
    if (close) {
      close();
    }
    hideModal();
  }

  render () {
    const {componentModel: {show, message}} = this.props;
    return (
      <Modal
        show={show}
        onHide={this.handleClose}
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
          <Modal.Title id='contained-modal-title'>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{padding: '1em', wordBreak: 'break-all'}}>
            {message &&
            <div dangerouslySetInnerHTML={{__html: marked(message)}}></div>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

