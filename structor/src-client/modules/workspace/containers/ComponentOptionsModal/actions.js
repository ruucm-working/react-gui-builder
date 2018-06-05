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

import { isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import { graphApi, serverApi } from 'api';
import { failed } from 'modules/app/containers/AppMessage/actions';

export const LOAD_OPTIONS_AND_SHOW_MODAL = "ComponentOptionsModal/LOAD_OPTIONS_AND_SHOW_MODAL";
export const SET_OPTIONS = "ComponentOptionsModal/SET_OPTIONS";
export const SAVE_SOURCE_CODE = "ComponentOptionsModal/SAVE_SOURCE_CODE";
export const SAVE_SOURCE_CODE_DONE = "ComponentOptionsModal/SAVE_SOURCE_CODE_DONE";
export const SAVE_SOURCE_CODE_TIMEOUT = "ComponentOptionsModal/SAVE_SOURCE_CODE_TIMEOUT";
export const HIDE_MODAL = "ComponentOptionsModal/HIDE_MODAL";
export const SHOW_MODAL = "ComponentOptionsModal/SHOW_MODAL";

export const loadOptionsAndShowModal = (componentObject) => ({
  type: LOAD_OPTIONS_AND_SHOW_MODAL,
  payload: componentObject
});
export const saveSourceCodeDone = () => ({type: SAVE_SOURCE_CODE_DONE});
export const saveSourceCodeTimeout = () => ({type: SAVE_SOURCE_CODE_TIMEOUT});
export const hideModal = () => ({type: HIDE_MODAL});
export const showModal = () => ({type: SHOW_MODAL});

export const setOptions = (componentObject) => (dispatch, getState) => {
    const {key, sourceFilePath, props, text, componentName, sourceCode, readmeText} = componentObject;
    dispatch({
        type: SET_OPTIONS, payload: {
            selectedKey: key,
            sourceCode: sourceCode,
            sourceFilePath: sourceFilePath,
            sourceProps: props ? JSON.stringify(props, null, 4) : JSON.stringify({}),
            sourceText: text,
            readmeText: readmeText
        }
    });
};

export const submitChanges = (componentObject) => (dispatch, getState) => {
    const {componentOptionsModal:{ selectedKey, sourceFilePath }} = getState();
    const {sourceCode, sourceProps, sourceText} = componentObject;
    let sourcePropsObj;
    try{
        sourcePropsObj = JSON.parse(sourceProps);
        if(sourcePropsObj.style && isEmpty(sourcePropsObj.style)) {
            delete sourcePropsObj.style;
        }
    } catch(e){
        dispatch(failed('Parsing properties error. Error: ' + (e.message ? e.message : e)));
    }
    if (sourcePropsObj) {
        dispatch({
            type: SAVE_SOURCE_CODE, payload: {
                key: selectedKey,
                sourceFilePath: sourceFilePath,
                sourcePropsObj: sourcePropsObj,
                text: sourceText,
                sourceCode: sourceCode
            }
        });
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, submitChanges
}, dispatch);
