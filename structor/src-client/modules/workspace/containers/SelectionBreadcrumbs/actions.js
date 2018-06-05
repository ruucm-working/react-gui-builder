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
import { graphApi } from 'api';
import { success, failed, timeout, close } from 'modules/app/containers/AppMessage/actions';
import { updateMarked } from 'modules/workspace/containers/DeskPage/actions';
import { loadReadmeText } from 'modules/workspace/containers/ComponentReadmePanel/actions';

export const SET_SELECTED_KEY = 'SelectionBreadcrumbs/SET_SELECTED_KEY';

export const setSelectedKey = (key, isModifier, button) => (dispatch, getState) => {
  let {selectionBreadcrumbs: {selectedKeys}} = getState();
  let filtered = selectedKeys.filter(selectedKey => key === selectedKey);
  if (filtered.length === 0) {
    // select new component on the page
    if (selectedKeys.length > 0 && !isModifier) {
      // there are already selected components - we need to clear selection on each
      selectedKeys.forEach(selectedKey => {
        let graphNode = graphApi.getNode(selectedKey);
        if (graphNode) {
          graphNode.selected = undefined;
        }
      });
      selectedKeys = [];
    }
    // set selection on graph node
    let nextGraphNode = graphApi.getNode(key);
    if (nextGraphNode) {
      nextGraphNode.selected = true;
      selectedKeys.push(key);
      dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
      dispatch(updateMarked());
    } else {
      dispatch(failed('Required to be selected component with id \'' + key + '\' was not found'));
    }
  } else {
    if (selectedKeys.length > 0) {
      // this component is already is among selected components
      let graphNode = graphApi.getNode(key);
      if (isModifier) {
        // remove selection from the component if user pressed modifier key
        if (graphNode) {
          graphNode.selected = undefined;
          selectedKeys = selectedKeys.filter(selectedKey => key !== selectedKey);
          dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
          dispatch(updateMarked());
        } else {
          dispatch(failed('Currently selected component with id \'' + key + '\' was not found'));
        }
      } else {
        if (button === undefined || button === 0) {
          // user didn't press modifier key - select another component and remove all selection marks
          // and we will do that only if user click the first button of the mouse or nothing
          if (graphNode) {
            selectedKeys.forEach(selectedKey => {
              let selectedGraphNode = graphApi.getNode(selectedKey);
              if (selectedGraphNode) {
                selectedGraphNode.selected = undefined;
              } else {
                dispatch(failed('Currently selected component with id \'' + key + '\' was not found'));
              }
            });
            graphNode.selected = true;
            selectedKeys = [key];
            dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
            dispatch(updateMarked());
          } else {
            dispatch(failed('Required to be selected component with id \'' + key + '\' was not found'));
          }
        }
      }
    }
  }
  if (selectedKeys && selectedKeys.length > 0) {
    let graphNode = graphApi.getNode(selectedKeys[0]);
    const {modelNode} = graphNode;
    dispatch(loadReadmeText(modelNode.type, modelNode.namespace));
  }
};

export const setSelectedParentKey = (key, isModifier) => (dispatch, getState) => {
  const parentKey = graphApi.getGraph().parent(key);
  if (parentKey) {
    const parentParentKey = graphApi.getGraph().parent(parentKey);
    if (parentParentKey) {
      dispatch(setSelectedKey(parentKey, isModifier));
    }
  }
};

export const setHighlightSelectedKey = (key, isHighlighted) => (dispatch, getState) => {
  let graphNode = graphApi.getNode(key);
  if (graphNode) {
    if (!isHighlighted) {
      graphNode.highlighted = undefined;
    } else if (isHighlighted) {
      graphNode.highlighted = true;
    }
    dispatch(updateMarked());
  }
};

export const removeSelectedKeys = () => (dispatch, getState) => {
  let {selectionBreadcrumbs: {selectedKeys}} = getState();
  let selectedNode;
  if (selectedKeys && selectedKeys.length > 0) {
    selectedKeys.forEach(key => {
      selectedNode = graphApi.getNode(key);
      if (selectedNode && selectedNode.selected) {
        selectedNode.selected = undefined;
      }
    });
    dispatch({type: SET_SELECTED_KEY, payload: []});
    dispatch(updateMarked());
  }
};

export const resetSelectedKeys = () => (dispatch, getState) => {
  let {selectionBreadcrumbs: {selectedKeys}} = getState();
  let newSelectedKeys = [];
  let selectedNode;
  if (selectedKeys && selectedKeys.length > 0) {
    selectedKeys.forEach(key => {
      selectedNode = graphApi.getNode(key);
      if (selectedNode && selectedNode.selected) {
        newSelectedKeys.push(key);
      }
    });
    dispatch({type: SET_SELECTED_KEY, payload: newSelectedKeys});
    dispatch(updateMarked());
    if (newSelectedKeys && newSelectedKeys.length > 0) {
      let graphNode = graphApi.getNode(newSelectedKeys[0]);
      const {modelNode} = graphNode;
      dispatch(loadReadmeText(modelNode.type, modelNode.namespace));
    }
  }
};

export const setSelectedKeys = (keys) => (dispatch, getState) => {
  if (keys && keys.length > 0) {
    const {selectionBreadcrumbs: {selectedKeys}} = getState();
    let selectedNode;
    if (selectedKeys && selectedKeys.length > 0) {
      selectedKeys.forEach(key => {
        selectedNode = graphApi.getNode(key);
        if (selectedNode && selectedNode.selected) {
          selectedNode.selected = undefined;
        }
      });
    }
    let newSelectedKeys = [];
    keys.forEach(key => {
      let nextGraphNode = graphApi.getNode(key);
      if (nextGraphNode) {
        nextGraphNode.selected = true;
        newSelectedKeys.push(key);
      } else {
        dispatch(failed('Required to be selected component with id \'' + key + '\' was not found'));
      }
    });
    dispatch({type: SET_SELECTED_KEY, payload: newSelectedKeys});
    dispatch(updateMarked());
    if (newSelectedKeys && newSelectedKeys.length > 0) {
      let graphNode = graphApi.getNode(newSelectedKeys[0]);
      const {modelNode} = graphNode;
      dispatch(loadReadmeText(modelNode.type, modelNode.namespace));
    }
  }
};

export const refreshSelectedKeys = () => (dispatch, getState) => {
  const {selectionBreadcrumbs: {selectedKeys}} = getState();
  dispatch({type: SET_SELECTED_KEY, payload: selectedKeys});
  if (selectedKeys && selectedKeys.length > 0) {
    let graphNode = graphApi.getNode(selectedKeys[0]);
    const {modelNode} = graphNode;
    dispatch(loadReadmeText(modelNode.type, modelNode.namespace));
  }
};

export const containerActions = (dispatch) => bindActionCreators({
  setSelectedKey, setHighlightSelectedKey, removeSelectedKeys
}, dispatch);
