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
import { removeSelectedKeys } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import { removeClipboardKeys } from 'modules/workspace/containers/ClipboardIndicator/actions';
import {
  updatePage,
  saveModel,
  changePageRoute,
  resetPages
} from 'modules/workspace/containers/DeskPage/actions';

export const UPDATE_HISTORY_COUNTER = 'HistoryControls/UPDATE_HISTORY_COUNTER';

export const pushHistory = () => (dispatch, getState) => {
  const {deskPage: {currentPagePath}} = getState();
  graphApi.pushHistory(currentPagePath);
  dispatch(saveModel());
  dispatch({type: UPDATE_HISTORY_COUNTER});
};

export const popHistory = () => (dispatch, getState) => {
  let historyObject = graphApi.popHistory();
  if (historyObject) {
    dispatch(removeClipboardKeys());
    dispatch(removeSelectedKeys());
    dispatch(resetPages());
    dispatch(updatePage());
    const {pagePath} = historyObject;
    if (pagePath) {
      dispatch(changePageRoute(pagePath));
    }
    dispatch({type: UPDATE_HISTORY_COUNTER});
  }
};

export const containerActions = (dispatch) => bindActionCreators({
  popHistory
}, dispatch);
