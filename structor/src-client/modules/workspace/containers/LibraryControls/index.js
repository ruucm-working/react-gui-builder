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
        this.onInstall = this.onInstall.bind(this);
        this.onExtract = this.onExtract.bind(this);
    }

    onInstall(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.showInstaller();
    }

    onExtract(e) {
        e.stopPropagation();
        e.preventDefault();
        const {showExtractor} = this.props;
        showExtractor();
    }

    render(){
        return (
            <div
                style={this.props.style}
                className="btn-group btn-group-justified"
                role="group"
            >
                <div className="btn-group">
                    <button
                        className="btn btn-default btn-sm"
                        onClick={this.onInstall}
                        title="Install new components"
                    >
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-cloud-download"/>
                        <span style={{marginLeft: '0.5em'}}>Install</span>
                    </span>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                        className="btn btn-default btn-sm"
                        onClick={this.onExtract}
                        title="Publish components"
                    >
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-cloud-upload"/>
                        <span style={{marginLeft: '0.5em'}}>Extract</span>
                    </span>
                    </button>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

