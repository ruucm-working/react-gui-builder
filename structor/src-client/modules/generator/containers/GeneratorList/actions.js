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
import { coockiesApi } from 'api';
import { loadGenerators } from 'modules/generator/containers/Generator/actions';

export const SET_GENERATORS = "GeneratorList/SET_GENERATORS";
export const SET_RECENT_GENERATORS = "GeneratorList/SET_RECENT_GENERATORS";
export const SET_SELECTED_TAB = "GeneratorList/SET_SELECTED_TAB";

export const setGenerators = (generators) => ({type: SET_GENERATORS, payload: {generators}});

export const setRecentGenerators = (recentGenerators) => ({type: SET_RECENT_GENERATORS, payload: recentGenerators});

export const setSelectedTab = (tabKey) => ({type: SET_SELECTED_TAB, payload: tabKey});

export const removeFromRecentGenerators = (generatorId) => (dispatch, getState) => {
    let recentGenerators = coockiesApi.removeFromRecentGenerators(generatorId);
    dispatch(setRecentGenerators(recentGenerators));
};

export const containerActions = (dispatch) => bindActionCreators({
    setSelectedTab
}, dispatch);
