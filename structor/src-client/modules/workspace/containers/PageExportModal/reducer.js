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
  showPageExportDialog: false,
  exportMode: null,
  selectedRoutes: {},
};

export default (state = initialState, action = {}) => {

  const {type, payload} = action;

  if (type === actions.SHOW_MODAL) {
    return Object.assign({}, state, {
      showPageExportDialog: true,
      exportMode: payload.exportMode,
    });
  }

  if (type === actions.HIDE_MODAL) {
    return Object.assign({}, state, {
      showPageExportDialog: false,
      exportMode: null,
    });
  }

  if(type === actions.TOGGLE_ROUTE_SELECTION){
    const {path} = payload;
    let selectedRoutes = Object.assign({}, state.selectedRoutes);
    selectedRoutes[path] = !selectedRoutes[path];
    return Object.assign({}, state, {selectedRoutes});
  }

  return state;
};

