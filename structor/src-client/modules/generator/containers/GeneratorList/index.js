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

import { Grid, Row, Col } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import { GeneratorKeyTitleView } from 'components';
import GeneratorBriefPanel from 'modules/generator/containers/GeneratorBriefPanel';

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            itemsPerPage: 7,
        };
        this.handleTabSelect = this.handleTabSelect.bind(this);
    }

    handleTabSelect(eventKey){
        if(eventKey){
            this.props.setSelectedTab(eventKey);
        }
    }

    render(){
        const {
            componentModel: {generators, recentGenerators, selectedTabKey}
        } = this.props;

        let generatorPanelList = [];
        if (selectedTabKey === 1) {
            if(generators && generators.length > 0) {
                generators.forEach((item, index) => {
                    generatorPanelList.push(
                        <GeneratorBriefPanel
                            key={item.name + index}
                            name={item.name}
                            dirPath={item.dirPath}
                            readmeFilePath={item.readmeFilePath}
                            screenshotFilePath={item.screenshotFilePath}
                            readmeText={item.readmeText}
                        />
                    );
                });
            }
        } else if (selectedTabKey === 2){
            if (generators && generators.length > 0 && recentGenerators && recentGenerators.length > 0) {
                generators.forEach((item, index) => {
                    if (recentGenerators.indexOf(item.name) >= 0) {
                        generatorPanelList.push(
                            <GeneratorBriefPanel
                                key={item.name + index}
                                name={item.name}
                                dirPath={item.dirPath}
                                readmeFilePath={item.readmeFilePath}
                                screenshotFilePath={item.screenshotFilePath}
                                readmeText={item.readmeText}
                                isRecentPanel={true}
                            />
                        );
                    }
                });
            }
        }

        return (
            <Grid fluid={ true }>
                <Row style={ { minHeight: '40em', position: 'relative'} }>
                    <Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
                        <Tabs
                            activeKey={selectedTabKey}
                            onSelect={this.handleTabSelect}
                            id="generatorListTabs"
                            animation={false}
                        >
                            <Tab
                                key="scaffoldGenerators"
                                eventKey={1}
                                title="Generators"
                            >
                                <div style={{marginTop: '2em'}}>
                                    {generatorPanelList}
                                </div>
                            </Tab>
                            <Tab
                                key="favoriteGenerators"
                                eventKey={2}
                                disabled={!recentGenerators || recentGenerators.length <= 0}
                                title="Recently Used"
                            >
                                <div style={{marginTop: '2em'}}>
                                    {generatorPanelList}
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connect(modelSelector, containerActions)(Container);

