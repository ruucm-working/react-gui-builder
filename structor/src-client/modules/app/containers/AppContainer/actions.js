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
import { failed } from 'modules/app/containers/AppMessage/actions';
import {
  setReloadPageRequest,
  executeReloadPageRequest,
  setEditModeOn,
  setLivePreviewModeOn
} from 'modules/workspace/containers/DeskPage/actions';
import { updateDeskLayout } from 'modules/workspace/containers/Desk/actions';
import { loadComponents } from 'modules/workspace/containers/LibraryPanel/actions';
import { updateOptionsPanelState } from 'modules/workspace/containers/ComponentOptionsPanel/actions';
import { setShowButtons } from 'modules/workspace/containers/BlueprintControls/actions';

export const GET_PROJECT_STATUS = 'AppContainer/GET_PROJECT_STATUS';
export const SET_PROJECT_INFO = 'AppContainer/SET_PROJECT_INFO';
export const SET_PROJECT_PROXY_URL = 'AppContainer/SET_PROJECT_PROXY_URL';
export const COMPILER_START = 'AppContainer/COMPILER_START';
export const COMPILER_DONE = 'AppContainer/COMPILER_DONE';
export const COMPILER_TIMEOUT = 'AppContainer/COMPILER_TIMEOUT';

export const SHOW_DESK = 'AppContainer/SHOW_DESK';
export const SHOW_GENERATOR = 'AppContainer/SHOW_GENERATOR';
export const HIDE_GENERATOR = 'AppContainer/HIDE_GENERATOR';
export const SHOW_INSTALLER = 'AppContainer/SHOW_INSTALLER';
export const HIDE_INSTALLER = 'AppContainer/HIDE_INSTALLER';
export const SHOW_EXTRACTOR = 'AppContainer/SHOW_EXTRACTOR';
export const HIDE_EXTRACTOR = 'AppContainer/HIDE_EXTRACTOR';

export const getProjectStatus = () => ({type: GET_PROJECT_STATUS});
export const setProjectInfo = (info) => ({type: SET_PROJECT_INFO, payload: info});
export const setProjectProxyURL = (proxyURL) => ({type: SET_PROJECT_PROXY_URL, payload: proxyURL});
export const compilerStart = () => ({type: COMPILER_START});
export const compilerDone = () => ({type: COMPILER_DONE});
export const compilerTimeout = () => ({type: COMPILER_TIMEOUT});

export const showDesk = () => ({type: SHOW_DESK});
export const showGenerator = () => ({type: SHOW_GENERATOR});
export const hideGenerator = () => ({type: HIDE_GENERATOR});
export const showInstaller = () => ({type: SHOW_INSTALLER});
export const hideInstaller = () => ({type: HIDE_INSTALLER});
export const showExtractor = () => ({type: SHOW_EXTRACTOR});
export const hideExtractor = () => ({type: HIDE_EXTRACTOR});

export const handleCompilerMessage = (message) => (dispatch, getState) => {
  if (message.status === 'start') {
    dispatch(compilerStart());
  } else if (message.status === 'done') {
    if (message.errors && message.errors.length > 0) {
      message.errors.forEach(error => {
        dispatch(failed(error.message ? error.message : error));
      });
      dispatch(setReloadPageRequest());
    } else {
      dispatch(loadComponents());
      dispatch(executeReloadPageRequest());
    }
    dispatch(compilerDone());
  }
};

export const setupDesk = () => (dispatch, getState) => {
  const deskSettings = coockiesApi.getDeskSettings();
  if (deskSettings) {
    const {isEditModeOn, layout, optionsPanel, showBlueprintButtons} = deskSettings;
    if (isEditModeOn || isEditModeOn === undefined) {
      dispatch(setEditModeOn());
    } else {
      dispatch(setLivePreviewModeOn());
    }
    if (layout) {
      dispatch(updateDeskLayout(layout));
    }
    if (optionsPanel) {
      dispatch(updateOptionsPanelState(optionsPanel));
    }
    if (showBlueprintButtons !== undefined) {
      dispatch(setShowButtons(showBlueprintButtons));
    }
  }
};

export const containerActions = (dispatch) => bindActionCreators({
  getProjectStatus
}, dispatch);