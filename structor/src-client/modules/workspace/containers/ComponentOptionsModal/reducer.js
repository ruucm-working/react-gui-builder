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

import * as actions from './actions.js';

const initialState = {
    selectedKey: undefined,
    sourceCode: undefined,
    sourceFilePath: undefined,
    sourceProps: undefined,
    sourceText: undefined,
    readmeText: undefined,
    show: false
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.HIDE_MODAL){
        return Object.assign({}, state, {
            selectedKey: undefined,
            sourceCode: undefined,
            sourceFilePath: undefined,
            sourceProps: undefined,
            sourceText: undefined,
            readmeText: undefined,
            show: false
        });
    }

    if(type === actions.SHOW_MODAL){
        return Object.assign({}, state, {show: true});
    }

    if(type === actions.SET_OPTIONS){
        return Object.assign({}, state, { ...payload });
    }

    return state;
}

