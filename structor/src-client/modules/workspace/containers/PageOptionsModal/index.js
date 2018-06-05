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
import { containerActions, ADD_NEW } from './actions.js';

import { Modal, Button } from 'react-bootstrap';
import { PageComponentForm } from 'components';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
  }

  handleClose (e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.hideModal();
  }

  handleSave (e) {
    e.stopPropagation();
    e.preventDefault();
    const {componentModel, change} = this.props;
    const options = this.refs.formPageName.getOptions();
    change(options, componentModel.mode);
  }

  handleSelectTab (eventKey) {
  }

  render () {
    const {componentModel, deskPageModel, hideModal} = this.props;
    return (
      <Modal show={componentModel.show}
             onHide={hideModal}
             dialogClassName='umy-modal-overlay umy-modal-middlesize'
             backdrop={true}
             keyboard={true}
             bsSize='large'
             ref='dialog'
             animation={true}>
        <Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
          <Modal.Title id='contained-modal-title'>Page options</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.handleSave}>
          <Modal.Body>
            <PageComponentForm
              ref="formPageName"
              pageName={componentModel.mode === ADD_NEW ? 'NewPage' : deskPageModel.currentPageName}
              pagePath={componentModel.mode === ADD_NEW ? '/new-page' : deskPageModel.currentPagePath}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button
              onClick={this.handleSave}
              bsStyle="primary"
              type="submit">
              Save changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

