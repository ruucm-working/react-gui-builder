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

import { bindActionCreators } from 'redux';
import {
    pasteBefore,
  pasteFirst,
  pasteLast,
  pasteAfter,
  pasteReplace
} from 'modules/workspace/containers/ClipboardControls/actions';

export const modeMap = {
    addBefore: {type: 'addBefore', label: 'Add before selected component'},
    addAfter: {type: 'addAfter', label: 'Add after selected component'},
    insertFirst: {type: 'insertAfter', label: 'Insert as first child in selected component'},
    insertLast: {type: 'insertLast', label: 'Insert as last child in selected component'},
    replace: {type: 'replace', label: 'Replace selected component'},
};

export const HIDE_MODAL = "QuickAppendModal/HIDE_MODAL";
export const SHOW_MODAL = "QuickAppendModal/SHOW_MODAL";

export const hideModal = () => ({type: HIDE_MODAL});

const showModal = (appendMode, targetKey) => ({type: SHOW_MODAL, payload: {appendMode, targetKey}});

export const quickBeforeModal = (targetKey) => (dispatch, getState) => {
    dispatch(showModal(modeMap.addBefore, targetKey));
};
export const quickFirstModal = (targetKey) => (dispatch, getState) => {
    dispatch(showModal(modeMap.insertFirst, targetKey));
};
export const quickLastModal = (targetKey) => (dispatch, getState) => {
    dispatch(showModal(modeMap.insertLast, targetKey));
};
export const quickAfterModal = (targetKey) => (dispatch, getState) => {
    dispatch(showModal(modeMap.addAfter, targetKey));
};
export const quickReplaceModal = (targetKey) => (dispatch, getState) => {
    dispatch(showModal(modeMap.replace, targetKey));
};

export const submit = (componentTuple, appendMode, targetKey) => (dispatch, getState) => {
    const componentNames = componentTuple.split('.');
    if(appendMode.type === modeMap.addBefore.type){
        dispatch(pasteBefore(targetKey, componentNames));
    } else if(appendMode.type === modeMap.addAfter.type){
        dispatch(pasteAfter(targetKey, componentNames));
    } else if(appendMode.type === modeMap.insertFirst.type){
        dispatch(pasteFirst(targetKey, componentNames));
    } else if(appendMode.type === modeMap.insertLast.type){
        dispatch(pasteLast(targetKey, componentNames));
    } else if(appendMode.type === modeMap.replace.type){
        dispatch(pasteReplace(targetKey, componentNames));
    }
    dispatch(hideModal());
};

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, submit
}, dispatch);
