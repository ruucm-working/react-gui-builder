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

import validator from 'validator';
import {isEmpty} from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Button } from 'react-bootstrap';
import { InputTextStateful  } from 'components';

const cellBoxStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
};

const validateName = (value) => {
    return value
        && value.length > 0
        && validator.isAlphanumeric(value);
};

const validateNonEmptyName = (value) => {
    if (value && value.length > 0) {
        return validator.isAlphanumeric(value);
    }
    return true;
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        const {generatorName, generatorDirPath, selectedComponentModel} = this.props;
        const {namespaceInput, componentNameInput} = this;
        const namespace = namespaceInput ? namespaceInput.getValue() : '';
        const componentName = componentNameInput.getValue();
        this.props.pregenerate(
            generatorName,
            generatorDirPath,
            namespace,
            componentName,
            selectedComponentModel
        );
    }

    render() {
        const {
            componentName,
            namespace,
            availableComponentNames,
            availableNamespaces
        } = this.props;

        let groupDataOptions = [];
        if (availableNamespaces && availableNamespaces.length > 0) {
            availableNamespaces.forEach((name, index) => {
                groupDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let componentsDataOptions = [];
        if (availableComponentNames && availableComponentNames.length > 0) {
            availableComponentNames.forEach((name, index) => {
                componentsDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let content = (
                <Grid fluid={ true }>
                    <Row style={ { position: 'relative'} }>
                        <Col
                            xs={ 6 }
                            md={ 6 }
                            sm={ 6 }
                            lg={ 6 }
                            xsOffset={3}
                            mdOffset={3}
                            smOffset={3}
                            lgOffset={3}
                        >
                            <div style={cellBoxStyle}>
                                <div style={{width: '70%', minWidth: '200px'}}>
                                    <form onSubmit={this.handleOnSubmit}>
                                        <label
                                            htmlFor="componentNameInput"
                                            className="form-label"
                                        >
                                            Component name
                                        </label>
                                        <InputTextStateful
                                            validateFunc={validateName}
                                            placeholder="Enter component name"
                                            id="componentNameInput"
                                            ref={me => this.componentNameInput = me}
                                            type="text"
                                            list="components"
                                            value={componentName}
                                            autoComplete="on"
                                        />
                                        <datalist id="components">
                                            {componentsDataOptions}
                                        </datalist>

                                        <label
                                            htmlFor="groupNameInput"
                                            className="form-label"
                                        >
                                            <span>
                                                Add Component In Namespace (optional)
                                            </span>
                                        </label>
                                        <InputTextStateful
                                            validateFunc={validateNonEmptyName}
                                            placeholder="Enter namespace"
                                            id="groupNameInput"
                                            ref={me => this.namespaceInput = me}
                                            type="text"
                                            list="groups"
                                            value={namespace}
                                            autoComplete="on"
                                        />
                                        <datalist id="groups">
                                            {groupDataOptions}
                                        </datalist>
                                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '2em'}}>
                                            <Button
                                                type="submit"
                                                bsStyle="primary"
                                            >
                                                Go to next stage
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            );
        return (
            <div>
                {content}
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

