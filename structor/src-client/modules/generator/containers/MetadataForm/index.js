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

import {isEmpty} from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Button } from 'react-bootstrap';
import { MetaOptionsContainer } from 'components';

const cellBoxStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enableNamespaceInput: false,
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleNamespaceCheck = this.handleNamespaceCheck.bind(this);
    }

    handleOnSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        let metadataObject = undefined;
        const {
            metaData,
            generatorName,
            generatorDirPath,
            selectedComponentModel,
            componentName,
            namespace
        } = this.props;
        const {metadataOptions} = this;
        if(metadataOptions) {
            metadataObject = Object.assign({}, metaData, metadataOptions.getOptionsObject());
        }
        this.props.generate(
            generatorName,
            generatorDirPath,
            namespace,
            componentName,
            selectedComponentModel,
            metadataObject
        );
    }

    handleNamespaceCheck(e) {
        this.setState({enableNamespaceInput: this.namespaceCheckbox.checked});
    }

    render() {
        const {
            metaData, metaHelp,
        } = this.props;

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
                                        {!isEmpty(metaData) &&
                                            <div style={{marginTop: '1em'}}>
                                                <MetaOptionsContainer
                                                    ref={me => this.metadataOptions = me}
                                                    optionsObject={metaData}
                                                    optionsHelpObject={metaHelp}
                                                />
                                            </div>
                                        }
                                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2em'}}>
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

