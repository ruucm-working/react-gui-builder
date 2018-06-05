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
    packageConfig: {},
    proxyURL: undefined,
    workspaceMode: undefined,
    paths: {},
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_PROJECT_INFO){
        return Object.assign({}, state, {
            paths: payload.project.paths,
            packageConfig: payload.server.packageConf
        });
    }

    if(type === actions.SET_PROJECT_PROXY_URL){
        return Object.assign({}, state, {
            proxyURL: payload
        });
    }

    if(type === actions.SHOW_DESK){
        return Object.assign({}, state, {
            workspaceMode: 'desk'
        });
    }

    if(type === actions.SHOW_GENERATOR){
        return Object.assign({}, state, {
            workspaceMode: 'generator'
        });
    }

    if(type === actions.SHOW_INSTALLER){
        return Object.assign({}, state, {
            workspaceMode: 'installer'
        });
    }

    if(type === actions.SHOW_EXTRACTOR){
        return Object.assign({}, state, {
            workspaceMode: 'extractor'
        });
    }

	if(type === actions.HIDE_GENERATOR
		|| type === actions.HIDE_INSTALLER
		|| type === actions.HIDE_EXTRACTOR){
		return Object.assign({}, state, {
			workspaceMode: 'desk'
		});
	}

	return state;

}


