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

import { Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { InputTextStateful } from 'components';

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitExisting = this.handleSubmitExisting.bind(this);
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
    const {submit, selectedComponents} = this.props;
    if (selectedComponents && selectedComponents.length === 1) {
      const variantName = this.inputName.getValue();
      if (variantName && variantName.length > 0) {
        submit(selectedComponents[0], variantName);
      } else {
        this.setState({
          errors: ['Enter model name value']
        });
      }
    }
  }

  handleSubmitExisting (e) {
    e.stopPropagation();
    e.preventDefault();
    const {submit, selectedComponents} = this.props;
    if (selectedComponents && selectedComponents.length === 1) {
      const variantName = e.currentTarget.dataset.variant;
      submit(selectedComponents[0], variantName);
    }
  }

  render () {
    const {componentModel: {show}, selectedComponents} = this.props;
    const {errors} = this.state;
    let title = '';
    let items = [];
    if (selectedComponents && selectedComponents.length === 1) {
      const {defaults, componentName, namespace} = selectedComponents[0];
      if (defaults && defaults.length > 0) {
        defaults.forEach((item, index) => {
          items.push(
            <ListGroupItem
              href="#"
              key={'' + item.variant + index}
              style={{position: 'relative'}}
              data-variant={item.variant || 'default'}
              onClick={this.handleSubmitExisting}
            >
              <span>{item.variant || 'default'}</span>
            </ListGroupItem>
          );
        });
      }
      title = `Save Model for ${componentName}`;
      if (namespace) {
        title += ` [${namespace}]`;
      }
    }
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
          <Modal.Title id='contained-modal-title'>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors && errors.length > 0 &&
          <div style={{padding: '1em'}}>
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
          <div style={{padding: '1em'}}>
            <InputTextStateful
              type="text"
              ref={me => this.inputName = me}
              label="Model name"
              placeholder="Enter new model name"
            />
            <p><label><span>Save as one of the existing models</span></label></p>
            <ListGroup>
              {items}
            </ListGroup>
          </div>
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

