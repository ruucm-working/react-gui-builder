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
    generatedData: {
        files: [],
        dependencies: {},
        defaults: [],
    },
    stage: actions.STAGE1,
    generatorName: undefined,
    generatorDirPath: undefined,
    namespace: undefined,
    componentName: undefined,
    metaData: undefined,
    metaHelp: undefined,
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.STEP_TO_STAGE){
        return Object.assign({}, state, {
            stage: payload
        });
    }

    if(type === actions.SET_GENERATED_DATA){
        return Object.assign({}, state, {
            generatedData: payload
        });
    }


    if(type === actions.SET_COMPONENT_METADATA){
        return Object.assign({}, state, {
            metaData: payload.metaData || state.metaData,
            metaHelp: payload.metaHelp || state.metaHelp,
        });
    }

    if(type === actions.SET_COMPONENT_NAME){
        return Object.assign({}, state, {
            namespace: payload.namespace,
            componentName: payload.componentName,
        });
    }

    if(type === actions.SET_SELECTED_GENERATOR){
        const {generatorName, generatorDirPath} = payload;
        return Object.assign({}, state, {generatorName, generatorDirPath});
    }

    return state;
}

