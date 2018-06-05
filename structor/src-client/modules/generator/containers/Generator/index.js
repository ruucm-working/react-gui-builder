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
import { containerActions, STAGE1, STAGE2, STAGE3, STAGE4 } from './actions.js';

import { ButtonGroup, Button } from 'react-bootstrap';

import GeneratorList from 'modules/generator/containers/GeneratorList';
import MetadataForm from 'modules/generator/containers/MetadataForm';
import ComponentNameForm from 'modules/generator/containers/ComponentNameForm';
import SourceFilesList from 'modules/generator/containers/SourceFilesList';

const toolbarLabelStyle = {
    margin: '0 1em'
};
const labelSectionStyle = {
    width: '35%',
    margin: '0 2em'
};
const centerSectionStyle = {
    width: '30%',
    display: 'flex',
    justifyContent: 'center'
};
const toolbarSectionStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1em'
};

const TITLE_STEP_1 = 'Select component generator';
const TITLE_STEP_2 = 'Enter component name';
const TITLE_STEP_3 = 'Enter component metadata';
const TITLE_STEP_4 = 'Preview generated source code';
const TITLE_STEP_5 = 'Install generated source code';

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleOnStep = this.handleOnStep.bind(this);
        this.handleOnSignIn = this.handleOnSignIn.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.refs.containerElement.scrollTop = 0;
    }

    componentDidUpdate() {
        this.refs.containerElement.scrollTop = 0;
    }

    handleOnStep(e) {
        e.stopPropagation();
        e.preventDefault();
        const stage = e.currentTarget.dataset.stage;
        if(stage){
            const {stepToStage} = this.props;
            stepToStage(e.currentTarget.dataset.stage);
        }
    }

    handleOnSignIn(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.showSignIn();
    }

    handleClose(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.hide();
    }

    render(){

        const { componentModel: {stage} } = this.props;

        const closeButton = (
            <Button onClick={this.handleClose}>
                <span style={toolbarLabelStyle}>Close</span>
            </Button>
        );

        let backStepLabel = null;
        let nextStepLabel = null;
        let toolbar = null;
        let header = null;
        let content = null;
        if(stage === STAGE1){
            nextStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_2}</h5>
            );
            toolbar = (
                <ButtonGroup bsSize="xs">
                    {closeButton}
                </ButtonGroup>
            );
            header = (<h4 className="text-center">{TITLE_STEP_1}</h4>);
            content = (<GeneratorList />);
        } else if(stage === STAGE2){
            backStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_1}</h5>
            );
            nextStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_3}</h5>
            );
            toolbar = (
                <ButtonGroup bsSize="xs">
                    <Button
                        data-stage={STAGE1}
                        onClick={this.handleOnStep}
                    >
                        <span style={toolbarLabelStyle}>Back</span>
                    </Button>
                    {closeButton}
                </ButtonGroup>
            );
            header = (<h4 className="text-center">{TITLE_STEP_2}</h4>);
            content = (<ComponentNameForm />);
        } else if(stage === STAGE3){
            backStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_2}</h5>
            );
            nextStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_4}</h5>
            );
            toolbar = (
                <ButtonGroup bsSize="xs">
                    <Button
                        data-stage={STAGE2}
                        onClick={this.handleOnStep}
                    >
                        <span style={toolbarLabelStyle}>Back</span>
                    </Button>
                    {closeButton}
                </ButtonGroup>
            );
            header = (<h4 className="text-center">{TITLE_STEP_3}</h4>);
            content = (<MetadataForm />);
        } else if(stage === STAGE4){
            backStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_3}</h5>
            );
            nextStepLabel = (
                <h5 className="text-muted text-center">{TITLE_STEP_5}</h5>
            );
            toolbar = (
                <ButtonGroup bsSize="xs">
                    <Button
                        data-stage={STAGE3}
                        onClick={this.handleOnStep}
                    >
                        <span style={toolbarLabelStyle}>Back</span>
                    </Button>
                    {closeButton}
                </ButtonGroup>
            );
            header = (<h4 className="text-center">{TITLE_STEP_4}</h4>);
            content = (<SourceFilesList />);
        }
        return (
            <div
                ref="containerElement"
                id="containerElement"
                style={{position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', overflow: 'auto'}}
            >
                <div style={{width: '100%', position: 'fixed', zIndex: '100', padding: '0 2em'}}>
                    <div style={{backgroundColor: '#f5f5f5', borderBottom: '1px solid #ffffff'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <div style={labelSectionStyle} >{backStepLabel}</div>
                            <div style={centerSectionStyle} >{header}</div>
                            <div style={labelSectionStyle} >{nextStepLabel}</div>
                        </div>
                        <div style={toolbarSectionStyle}>{toolbar}</div>
                    </div>
                </div>
                <div style={{marginTop: '6em', padding: '2em 2em 2em 2em' }}>
                    {content}
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

