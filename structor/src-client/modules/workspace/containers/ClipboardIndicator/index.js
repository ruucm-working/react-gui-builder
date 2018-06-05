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
import {
    containerActions,
    CLIPBOARD_COPY,
    CLIPBOARD_CUT,
    CLIPBOARD_EMPTY,
    CLIPBOARD_NEW
} from './actions.js';
import { graphApi } from 'api';

const makeTitle = (componentName) => {
  let titleComponentName = componentName;
  if(titleComponentName && titleComponentName.length > 30){
    titleComponentName = titleComponentName.substr(0, 27) + '...';
  }
  return titleComponentName;
};

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { componentModel: {clipboardMode, clipboardKeys}} = this.props;
        const { removeClipboardKeys } = this.props;

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center'
            //padding: '0px 0px 0px 10px'
        };
        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px 0.5em 0px 0px'
        };
        let typeLabelStyle = {
            padding: '3px 6px',
            borderRadius: '3px',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 227, 227)',
            color: 'rgb(107, 107, 107)',
            marginRight: '0.3em',
            textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
        };
        let activeStyle = {
            padding: '2px 6px',
            borderRadius: '3px'};
        let clipboardTypeLabel;
        if(clipboardMode === CLIPBOARD_COPY){
            activeStyle.backgroundColor = '#f2fae3';
            activeStyle.color = '#659f13';
            activeStyle.border = '1px solid #659f13';
            clipboardTypeLabel = 'Copied in clipboard';
        } else if(clipboardMode === CLIPBOARD_CUT){
            activeStyle.backgroundColor = '#fffceb';
            activeStyle.color = '#e28327';
            activeStyle.border = '1px solid #e28327';
            clipboardTypeLabel = 'Cut in clipboard';
        } else if(clipboardMode === CLIPBOARD_NEW){
            activeStyle.backgroundColor = '#ebf7fd';
            activeStyle.color = '#2d7091';
            activeStyle.border = '1px solid #2d7091';
            clipboardTypeLabel = 'New in clipboard';
        } else {
            clipboardTypeLabel = 'Empty clipboard';
        }
        let clipboardContent = null;
        if(clipboardKeys && clipboardKeys.length > 0){

            if(clipboardKeys.length === 1){
                let clipboardNode = graphApi.getNode(clipboardKeys[0]);
                if(clipboardNode){
                    const {modelNode} = clipboardNode;
                    clipboardContent = (
                    <span style={activeStyle}>
                        <span>{makeTitle(modelNode.type)}</span>
                        {modelNode.namespace &&
                        <span style={{marginLeft: '0.3em'}}>{'[' + makeTitle(modelNode.namespace) + ']'}</span>
                        }
                    </span>
                    );
                }
            } else if(clipboardKeys.length > 0) {
                const childrenMenuItems = [];
                let clipboardNode;
                clipboardKeys.forEach((key, index) => {
                    clipboardNode = graphApi.getNode(key);
                    if(clipboardNode){
                        const {modelNode} = clipboardNode;
                        childrenMenuItems.push(
                            <li key={'menuItem' + index}>
                                <a href="#"
                                   onClick={(e) => {e.stopPropagation(); e.preventDefault();}}
                                   style={{display: 'flex', alignItems: 'center'}}>
                                    <span>{modelNode.type}</span>
                                    {modelNode.namespace &&
                                    <span style={{marginLeft: '0.3em'}}>{'[' + modelNode.namespace + ']'}</span>
                                    }
                                </a>
                            </li>
                        );
                    }
                });
                clipboardContent = (
                    <span key={'menuMore'}
                          className="dropdown"
                          style={activeStyle}>
                        <span className="dropdown-toggle" data-toggle="dropdown">
                            <span>Multiple...&nbsp;</span><span className="caret"></span>
                        </span>
                        <ul className="dropdown-menu dropdown-menu-right"
                            role="menu"
                            style={{overflowY: 'auto', maxHeight: '12em'}}>
                            {childrenMenuItems}
                        </ul>
                    </span>
                );
            }
        }
        return (
            <div style={this.props.style}>
                <div style={containerStyle}>
                    <span style={typeLabelStyle}
                          onClick={() => {removeClipboardKeys();}}
                          title="Click to remove items from clipboard.">
                        {clipboardMode !== CLIPBOARD_EMPTY ? <i className="fa fa-times-circle fa-fw"
                           style={{opacity: '0.6'}}></i> : null }
                        <span>{clipboardTypeLabel}</span>
                    </span>
                    {clipboardContent}
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

