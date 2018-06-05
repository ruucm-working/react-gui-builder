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
    pages: [],
    currentPageIndex: -1,
    currentPageName: null,
    currentPagePath: null,
    pagePathToChange: undefined,
    reloadPageRequest: false,
    isEditModeOn: true,
    isLivePreviewModeOn: false,

    reloadPageCounter: 0,
    markedUpdateCounter: 0,
    modelUpdateCounter: 0
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.RELOAD_PAGE){
        return Object.assign({}, state, {
            reloadPageCounter: state.reloadPageCounter + 1
        });
    }

    if(type === actions.CHANGE_PAGE_ROUTE){
        return Object.assign({}, state, {
            pagePathToChange: payload
        });
    }

    if(type === actions.CHANGE_PAGE_ROUTE_FEEDBACK){
        let pageIndex = -1;
        for(let i = 0; i < state.pages.length; i++){
            if(state.pages[i].pagePath === payload){
                pageIndex = i;
                break;
            }
        }
        if(pageIndex >= 0){
            return Object.assign({}, state, {
                currentPagePath: state.pages[pageIndex].pagePath,
                currentPageName: state.pages[pageIndex].pageName,
                currentPageIndex: pageIndex,
                pagePathToChange: null
            });
        }
    }

    if(type === actions.SET_PAGES){
        if(payload && payload.length > 0){
            let pageIndex = -1;
            for(let i = 0; i < payload.length; i++){
                if(payload[i].pagePath === state.currentPagePath){
                    pageIndex = i;
                    break;
                }
            }
            return Object.assign({}, state, {
                pages: payload,
                currentPageIndex: pageIndex
            });
        }
    }

    if(type === actions.SET_EDIT_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: true,
            isLivePreviewModeOn: false,
            modelUpdateCounter: state.modelUpdateCounter + 1
        });
    }

    if(type === actions.SET_LIVE_PREVIEW_MODE_ON){
        return Object.assign({}, state, {
            isEditModeOn: false,
            isLivePreviewModeOn: true,
            modelUpdateCounter: state.modelUpdateCounter + 1
        });
    }

    if(type === actions.SET_RELOAD_PAGE_REQUEST){
        return Object.assign({}, state, {
            reloadPageRequest: true
        });
    }

    if(type === actions.EXECUTE_RELOAD_PAGE_REQUEST){
        if(state.reloadPageRequest){
            return Object.assign({}, state, {
                reloadPageCounter: state.reloadPageCounter + 1,
                reloadPageRequest: false
            });
        }
    }

    if(type === actions.UPDATE_MARKED){
        return Object.assign({}, state, {
            markedUpdateCounter: state.markedUpdateCounter + 1
        });
    }

    if(type === actions.UPDATE_PAGE){
        return Object.assign({}, state, {
            modelUpdateCounter: state.modelUpdateCounter + 1
        });
    }

    return state;
}

