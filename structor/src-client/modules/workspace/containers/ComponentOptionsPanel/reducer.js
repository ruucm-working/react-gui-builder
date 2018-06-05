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
import { initialExpandedStyleGroups } from './constants';

const initialState = {
  activeTab: 1,
  expandedStyleSections: initialExpandedStyleGroups,
  favoriteStylePaths: [],
};

export default (state = initialState, action = {}) => {

  const {type, payload} = action;

  if (type === actions.SET_ACTIVE_TAB) {
    return Object.assign({}, state, {
      activeTab: payload
    });
  }

  if (type === actions.TOGGLE_STYLE_SECTION) {
    let newExpandedStyleSections = Object.assign({}, state.expandedStyleSections);
    newExpandedStyleSections[payload] = !newExpandedStyleSections[payload];
    return Object.assign({}, state, {
      expandedStyleSections: newExpandedStyleSections
    });
  }

  if (type === actions.TOGGLE_FAVORITE) {
    let favoriteStylePaths = [].concat(state.favoriteStylePaths);
    const foundInex = favoriteStylePaths.findIndex(i => i === payload);
    if (foundInex >= 0) {
      favoriteStylePaths.splice(foundInex, 1);
    } else {
      favoriteStylePaths.push(payload);
    }
    return Object.assign({}, state, {favoriteStylePaths});
  }

  if (type === actions.UPDATE_OPTIONS_PANEL_STATE) {
    const {expandedStyleSections, favoriteStylePaths, activeTab} = payload;
    return Object.assign({}, state, {
      expandedStyleSections,
      favoriteStylePaths,
      activeTab
    });
  }

  return state;
};

