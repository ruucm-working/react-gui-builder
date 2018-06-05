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

import {forOwn, isObject} from 'lodash';
import * as actions from './actions.js';
import {recentGroupKey} from './constants';

const initialState = {
    componentTree: {},
    expandedGroupKeys: {},
    expandedComponentKeys: {},
    recentlyUsed: [],
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.SET_COMPONENTS){
        return Object.assign({}, state, {
            componentTree: Object.assign({}, payload.componentTree),
        });
    }

    if(type === actions.TOGGLE_PANEL_GROUP) {
        let newExpandedGroupKeys = Object.assign({}, state.expandedGroupKeys);
        newExpandedGroupKeys[payload] = !newExpandedGroupKeys[payload];
        return Object.assign({}, state, {
            expandedGroupKeys: newExpandedGroupKeys
        });
    }

    if(type === actions.TOGGLE_ITEM_GROUP) {
        let newExpandedComponentKeys = Object.assign({}, state.expandedComponentKeys);
        newExpandedComponentKeys[payload] = !newExpandedComponentKeys[payload];
        return Object.assign({}, state, {
            expandedComponentKeys: newExpandedComponentKeys
        });
    }

    if(type === actions.ADD_RECENTLY_USED) {
        const {componentName, namespace} = payload;
        let newState = Object.assign({}, state);
        let newRecentlyUsed = [].concat(state.recentlyUsed);
        if(newRecentlyUsed.length === 0) {
            let newExpandedGroupKeys = Object.assign({}, state.expandedGroupKeys);
            newExpandedGroupKeys[recentGroupKey] = true;
            newState.expandedGroupKeys = newExpandedGroupKeys;
        }
        const found = newRecentlyUsed.find(i => {
            if (namespace) {
                return i.namespace === namespace && i.componentName === componentName;
            } else {
                return i.componentName === componentName;
            }
        });
        if(!found){
            newRecentlyUsed.splice(0, 0, {componentName, namespace});
        }
        if(newRecentlyUsed.length > 10){
            newRecentlyUsed = newRecentlyUsed.slice(0, 10);
        }
        newState.recentlyUsed = newRecentlyUsed;
        return newState;
    }

    return state;
}

