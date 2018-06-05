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

const buttonLabelStyle = {
    margin: '0 0.5em'
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onGenerate = this.onGenerate.bind(this);
        this.onSaveDefaultModel = this.onSaveDefaultModel.bind(this);
    }

    onEdit(e) {
        e.stopPropagation();
        e.preventDefault();
        const {selectedComponents, loadOptionsAndShowModal} = this.props;
        if (selectedComponents && selectedComponents.length === 1) {
          loadOptionsAndShowModal(selectedComponents[0]);
        }
    }

    onGenerate(e) {
        e.stopPropagation();
        e.preventDefault();
        const {loadGenerators} = this.props;
        loadGenerators();
    }

    onSaveDefaultModel(e) {
        e.stopPropagation();
        e.preventDefault();
        const {showSaveDefaultModelModal} = this.props;
        showSaveDefaultModelModal();
    }

    render(){
        const {selectedComponents} = this.props;
        const isEnabled = selectedComponents && selectedComponents.length === 1;
        return (
            <div style={this.props.style} className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    disabled={!isEnabled}
                    onClick={this.onEdit}
                    title="Show selected component options">
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-wrench"/>
                        <span style={{marginLeft: '0.3em'}}>Edit</span>
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={!isEnabled}
                    onClick={this.onGenerate}
                    title="Generate the source code for a new component">
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-magic"/>
                        <span style={{marginLeft: '0.3em'}}>New Component</span>
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={!isEnabled}
                    onClick={this.onSaveDefaultModel}
                    title="Save current component model as a variant">
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-bookmark-o"/>
                        <span style={{marginLeft: '0.3em'}}>Save Model</span>
                    </span>
                </button>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

