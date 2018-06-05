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
import { graphApi, utilsStore } from 'api';
import { updateMarked, updatePage } from 'modules/workspace/containers/DeskPage/actions';
import {
  removeSelectedKeys,
  setSelectedKeys
} from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import {
  removeClipboardKeys,
  CLIPBOARD_COPY,
  CLIPBOARD_CUT,
  CLIPBOARD_NEW
} from 'modules/workspace/containers/ClipboardIndicator/actions';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import {
  quickBeforeModal,
  quickFirstModal,
  quickLastModal,
  quickAfterModal,
  quickReplaceModal
} from 'modules/workspace/containers/QuickAppendModal/actions';
import { setHighlightSelectedKey } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';

const setTargetKey = (targetKey, selectedKeys) => {
  let selectedNode;
  if (selectedKeys && selectedKeys.length > 0) {
    selectedKeys.forEach(key => {
      selectedNode = graphApi.getNode(key);
      if (selectedNode && selectedNode.selected) {
        selectedNode.selected = undefined;
      }
    });
  }
  let nextGraphNode = graphApi.getNode(targetKey);
  if (nextGraphNode) {
    nextGraphNode.selected = true;
  }
};

export const pasteBefore = (targetKey, componentNames) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardMode, clipboardKeys},
    libraryPanel: {componentTree}
  } = getState();
  let resultKeys;
  if (targetKey) {
    dispatch(setSelectedKeys([targetKey]));
    dispatch(setHighlightSelectedKey(targetKey, false));
  }
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pushHistory());
    if (clipboardMode === CLIPBOARD_CUT) {
      resultKeys = graphApi.cutPasteBeforeOrAfter(false);
      dispatch(removeClipboardKeys());
    } else if (clipboardMode === CLIPBOARD_COPY) {
      resultKeys = graphApi.copyPasteBeforeOrAfter(false);
    } else if (clipboardMode === CLIPBOARD_NEW) {
      resultKeys = graphApi.fromBufferBeforeOrAfter(false);
      dispatch(removeClipboardKeys());
    }
  } else {
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
      dispatch(pushHistory());
      resultKeys = [].concat(graphApi.quickBeforeOrAfter(variantModel, false));
    } else {
      console.error('Quick add before: model for variant key was not found');
    }
  }
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const pasteAfter = (targetKey, componentNames) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardMode, clipboardKeys},
    libraryPanel: {componentTree}
  } = getState();
  let resultKeys;
  if (targetKey) {
    dispatch(setSelectedKeys([targetKey]));
    dispatch(setHighlightSelectedKey(targetKey, false));
  }
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pushHistory());
    if (clipboardMode === CLIPBOARD_CUT) {
      resultKeys = graphApi.cutPasteBeforeOrAfter(true);
      dispatch(removeClipboardKeys());
    } else if (clipboardMode === CLIPBOARD_COPY) {
      resultKeys = graphApi.copyPasteBeforeOrAfter(true);
    } else if (clipboardMode === CLIPBOARD_NEW) {
      resultKeys = graphApi.fromBufferBeforeOrAfter(true);
      dispatch(removeClipboardKeys());
    }
  } else {
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
      dispatch(pushHistory());
      resultKeys = [].concat(graphApi.quickBeforeOrAfter(variantModel, true));
    } else {
      console.error('Quick add after: model for variant key was not found');
    }
  }
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const pasteFirst = (targetKey, componentNames) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardMode, clipboardKeys},
    libraryPanel: {componentTree}
  } = getState();
  let resultKeys;
  if (targetKey) {
    dispatch(setSelectedKeys([targetKey]));
    dispatch(setHighlightSelectedKey(targetKey, false));
  }
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pushHistory());
    if (clipboardMode === CLIPBOARD_CUT) {
      resultKeys = graphApi.cutPasteFirstOrLast(true);
      dispatch(removeClipboardKeys());
    } else if (clipboardMode === CLIPBOARD_COPY) {
      resultKeys = graphApi.copyPasteFirstOrLast(true);
    } else if (clipboardMode === CLIPBOARD_NEW) {
      resultKeys = graphApi.fromBufferFirstOrLast(true);
      dispatch(removeClipboardKeys());
    }
  } else {
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
      dispatch(pushHistory());
      resultKeys =  [].concat(graphApi.quickFirstOrLast(variantModel, true));
    } else {
      console.error('Quick add as first: model for variant key was not found');
    }
  }
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const pasteLast = (targetKey, componentNames) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardMode, clipboardKeys},
    libraryPanel: {componentTree}
  } = getState();
  let resultKeys;
  if (targetKey) {
    dispatch(setSelectedKeys([targetKey]));
    dispatch(setHighlightSelectedKey(targetKey, false));
  }
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pushHistory());
    if (clipboardMode === CLIPBOARD_CUT) {
      resultKeys = graphApi.cutPasteFirstOrLast(false);
      dispatch(removeClipboardKeys());
    } else if (clipboardMode === CLIPBOARD_COPY) {
      resultKeys = graphApi.copyPasteFirstOrLast(false);
    } else if (clipboardMode === CLIPBOARD_NEW) {
      resultKeys = graphApi.fromBufferFirstOrLast(false);
      dispatch(removeClipboardKeys());
    }
  } else {
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
      dispatch(pushHistory());
      resultKeys = [].concat(graphApi.quickFirstOrLast(variantModel, false));
    } else {
      console.error('Quick add as first: model for variant key was not found');
    }
  }
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const pasteReplace = (targetKey, componentNames) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardMode, clipboardKeys},
    libraryPanel: {componentTree}
  } = getState();
  let resultKeys;
  if (targetKey) {
    dispatch(setSelectedKeys([targetKey]));
    dispatch(setHighlightSelectedKey(targetKey, false));
  }
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pushHistory());
    if (clipboardMode === CLIPBOARD_CUT) {
      resultKeys = graphApi.cutPasteReplace();
      dispatch(removeClipboardKeys());
    } else if (clipboardMode === CLIPBOARD_COPY) {
      resultKeys = graphApi.copyPasteReplace();
    } else if (clipboardMode === CLIPBOARD_NEW) {
      resultKeys = graphApi.fromBufferReplace();
      dispatch(removeClipboardKeys());
    }
  } else {
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
      dispatch(pushHistory());
      resultKeys = [].concat(graphApi.quickReplace(variantModel));
    } else {
      console.error('Quick replace: model for variant key was not found');
    }
  }
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const handleBefore = (targetKey) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardKeys},
  } = getState();
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pasteBefore(targetKey));
  } else {
    dispatch(quickBeforeModal(targetKey));
  }
};

export const handleFirst = (targetKey) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardKeys},
  } = getState();
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pasteFirst(targetKey));
  } else {
    dispatch(quickFirstModal(targetKey));
  }
};

export const handleLast = (targetKey) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardKeys},
  } = getState();
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pasteLast(targetKey));
  } else {
    dispatch(quickLastModal(targetKey));
  }
};

export const handleAfter = (targetKey) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardKeys},
  } = getState();
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pasteAfter(targetKey));
  } else {
    dispatch(quickAfterModal(targetKey));
  }
};

export const handleReplace = (targetKey) => (dispatch, getState) => {
  const {
    clipboardIndicator: {clipboardKeys},
  } = getState();
  if (clipboardKeys && clipboardKeys.length > 0) {
    dispatch(pasteReplace(targetKey));
  } else {
    dispatch(quickReplaceModal(targetKey));
  }
};

export const containerActions = (dispatch) => bindActionCreators({
  handleBefore,
  handleFirst,
  handleLast,
  handleAfter,
  handleReplace
}, dispatch);
