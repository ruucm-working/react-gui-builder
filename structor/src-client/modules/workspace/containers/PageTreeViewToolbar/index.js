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
import { modeMap } from 'modules/workspace/containers/QuickAppendModal/actions.js';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    handleButtonClick = (type) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { selectionBreadcrumbsModel: {selectedKeys}, clipboardIndicatorModel: {clipboardKeys} } = this.props;
        const {
            pasteBefore,
            pasteAfter,
            pasteFirst,
            pasteLast,
            pasteReplace,
            showQuickAppend
        } = this.props;
        const {
            setForCuttingKeys,
            setForCopyingKeys,
            cloneSelected,
            moveSelected,
            deleteSelected
        } = this.props;
        switch(type) {
            case 'copy':
                setForCopyingKeys(selectedKeys);
                break;
            case 'cut':
                setForCuttingKeys(selectedKeys);
                break;
            case 'duplicate':
                cloneSelected();
                break;
            case 'moveUp':
                moveSelected(true);
                break;
            case 'moveDown':
                moveSelected(false);
                break;
            case 'delete':
                deleteSelected();
                break;
            case 'pasteBefore':
                if(clipboardKeys.length <= 0) {
                    showQuickAppend(modeMap.addBefore);
                } else {
                    pasteBefore();
                }
                break;
            case 'pasteAfter':
                if(clipboardKeys.length <= 0) {
                    showQuickAppend(modeMap.addAfter);
                } else {
                    pasteAfter();
                }
                break;
            case 'pasteFirst':
                if(clipboardKeys.length <= 0) {
                    showQuickAppend(modeMap.insertFirst);
                } else {
                    pasteFirst();
                }
                break;
            case 'pasteLast':
                if(clipboardKeys.length <= 0) {
                    showQuickAppend(modeMap.insertLast);
                } else {
                    pasteLast();
                }
                break;
            case 'pasteReplace':
                if(clipboardKeys.length <= 0) {
                    showQuickAppend(modeMap.replace);
                } else {
                    pasteReplace();
                }
                break;
            default:
                break;
        }
    };

    render(){
        const { selectionBreadcrumbsModel: {selectedKeys} } = this.props;
        return (
            <div style={this.props.style}>
                <div className="btn-group-vertical btn-group-xs">
                    {/*<button*/}
                        {/*className="btn btn-default"*/}
                        {/*disabled={selectedKeys.length <= 0}*/}
                        {/*onClick={this.handleButtonClick('pasteBefore')}*/}
                        {/*title="Append components before selected component">*/}
                        {/*<span className="umy-icon-arrow-plus-down" />*/}
                    {/*</button>*/}
                    {/*<button*/}
                        {/*className="btn btn-default"*/}
                        {/*disabled={selectedKeys.length <= 0}*/}
                        {/*onClick={this.handleButtonClick('pasteFirst')}*/}
                        {/*title="Insert components into selected component as the first child">*/}
                        {/*<span className="umy-icon-arrow-plus-up rotate-clockwise" />*/}
                    {/*</button>*/}
                    {/*<button*/}
                        {/*className="btn btn-default"*/}
                        {/*disabled={selectedKeys.length <= 0}*/}
                        {/*onClick={this.handleButtonClick('pasteReplace')}*/}
                        {/*title="Replace selected component">*/}
                        {/*<span className="umy-icon-replace" />*/}
                    {/*</button>*/}
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('copy')}
                        title="Copy selected components to clipboard">
                        <span className="fa fa-clipboard" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('cut')}
                        title="Cut selected components to clipboard">
                        <span className="fa fa-scissors" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('duplicate')}
                        title="Clone selected components">
                        <span className="fa fa-clone" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('moveUp')}
                        title="Move up selected components within their parents">
                        <span className="fa fa-arrow-up" />
                    </button>
                    <button
                        className="btn btn-default"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('moveDown')}
                        title="Move down selected components within their parents">
                        <span className="fa fa-arrow-down" />
                    </button>
                    <button
                        className="btn btn-warning"
                        disabled={selectedKeys.length <= 0}
                        onClick={this.handleButtonClick('delete')}
                        title="Delete selected components">
                        <span className="fa fa-trash-o" />
                    </button>
                    {/*<button*/}
                        {/*className="btn btn-default"*/}
                        {/*disabled={selectedKeys.length <= 0}*/}
                        {/*onClick={this.handleButtonClick('pasteLast')}*/}
                        {/*title="Insert components into selected component as the last child">*/}
                        {/*<span className="umy-icon-arrow-plus-down rotate-clockwise" />*/}
                    {/*</button>*/}
                    {/*<button*/}
                        {/*className="btn btn-default"*/}
                        {/*disabled={selectedKeys.length <= 0}*/}
                        {/*onClick={this.handleButtonClick('pasteAfter')}*/}
                        {/*title="Append components after selected component">*/}
                        {/*<span className="umy-icon-arrow-plus-up" />*/}
                    {/*</button>*/}
                </div>
            </div>
        );
    }
}

export default connect(modelSelector, containerActions)(Container);
