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

import { Modal, Button } from 'react-bootstrap';
import { ProxyInput } from 'components';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideModal();
    }

    handleSave(e){
        e.stopPropagation();
        e.preventDefault();
        const { save } = this.props;
        save(this.urlInputElement.getUrlValue() || null);
    }

    render() {
        const { componentModel, appContainerModel: {proxyURL}, hideModal } = this.props;
        return (

            <Modal
                show={componentModel.show}
                onHide={hideModal}
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
                    <Modal.Title id='contained-modal-title'>Proxy URL settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{padding: "1em"}}>
                        <ProxyInput
                            ref={me => this.urlInputElement = me}
                            urlValue={proxyURL}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button onClick={this.handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

