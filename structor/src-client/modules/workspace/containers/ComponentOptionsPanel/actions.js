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

import { merge, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import { utils, graphApi } from 'api';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import { refreshSelectedKeys } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import { updatePage } from 'modules/workspace/containers/DeskPage/actions';
import { failed } from 'modules/app/containers/AppMessage/actions';

export const SET_ACTIVE_TAB = 'ComponentOptionsPanel/SET_ACTIVE_TAB';
export const TOGGLE_STYLE_SECTION = 'ComponentOptionsPanel/TOGGLE_STYLE_SECTION';
export const TOGGLE_FAVORITE = 'ComponentOptionsPanel/TOGGLE_FAVORITE';
export const UPDATE_OPTIONS_PANEL_STATE = 'ComponentOptionsPanel/UPDATE_OPTIONS_PANEL_STATE';

export const deleteOption = (selectedComponents, optionPath) => (dispatch, getState) => {
  if (selectedComponents && selectedComponents.length > 0) {
    dispatch(pushHistory());
    let node;
    let newProps;
    selectedComponents.forEach(componentObject => {
      node = graphApi.getNode(componentObject.key);
      if (node) {
        newProps = utils.delex(utils.fulex(componentObject.props), optionPath);
        if (newProps.style && isEmpty(newProps.style)) {
          delete newProps.style;
        }
        node.modelNode.props = newProps;
      }
    });
    dispatch(refreshSelectedKeys());
    dispatch(updatePage());
  }
};

export const changeOption = (selectedComponents, optionObject) => (dispatch, getState) => {
  if (selectedComponents && selectedComponents.length > 0) {
    dispatch(pushHistory());
    let node;
    let newProps;
    selectedComponents.forEach(componentObject => {
      node = graphApi.getNode(componentObject.key);
      if (node) {
        newProps = merge({}, componentObject.props, optionObject);
        if (newProps.style && isEmpty(newProps.style)) {
          delete newProps.style;
        }
        node.modelNode.props = newProps;
      }
    });
    dispatch(refreshSelectedKeys());
    dispatch(updatePage());
  }
};

export const setActiveTab = (activeTab) => ({type: SET_ACTIVE_TAB, payload: activeTab});
export const toggleStyleSection = (sectionKey) => ({type: TOGGLE_STYLE_SECTION, payload: sectionKey});
export const toggleFavorite = (stylePath) => ({type: TOGGLE_FAVORITE, payload: stylePath});
export const updateOptionsPanelState = (newState) => ({type: UPDATE_OPTIONS_PANEL_STATE, payload: newState});

export const containerActions = (dispatch) => bindActionCreators({
  deleteOption,
  changeOption,
  setActiveTab,
  toggleStyleSection,
  toggleFavorite,
}, dispatch);