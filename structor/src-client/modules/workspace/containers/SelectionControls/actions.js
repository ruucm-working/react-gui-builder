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
import {
  setForCuttingKeys,
  setForCopyingKeys,
  resetClipboardKeys
} from 'modules/workspace/containers/ClipboardIndicator/actions';
import { graphApi } from 'api';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import { updatePage } from 'modules/workspace/containers/DeskPage/actions';
import { removeSelectedKeys, setSelectedKeys } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';

export const cloneSelected = () => (dispatch, getState) => {
  dispatch(pushHistory());
  let resultKeys = graphApi.cloneSelected();
  if (resultKeys && resultKeys.length > 0) {
    dispatch(setSelectedKeys(resultKeys));
    dispatch(updatePage());
  }
};

export const moveSelected = (isUp) => (dispatch, getState) => {
  dispatch(pushHistory());
  graphApi.moveSelected(isUp);
  dispatch(updatePage());
};

export const deleteSelected = () => (dispatch, getState) => {
  dispatch(pushHistory());
  const resultKeys = graphApi.deleteSelected();
  dispatch(resetClipboardKeys());
  dispatch(removeSelectedKeys());
  dispatch(setSelectedKeys(resultKeys));
  dispatch(updatePage());
};

export const containerActions = (dispatch) => bindActionCreators({
  setForCuttingKeys, setForCopyingKeys, cloneSelected, moveSelected, deleteSelected
}, dispatch);
