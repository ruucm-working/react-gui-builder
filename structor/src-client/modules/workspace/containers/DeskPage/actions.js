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
import { utils, utilsStore, graphApi, coockiesApi } from 'api';
import { success, failed, timeout, close } from 'modules/app/containers/AppMessage/actions';
import {
  setForCuttingKeys,
  setForCopyingKeys,
  resetClipboardKeys
} from 'modules/workspace/containers/ClipboardIndicator/actions';
import {
  handleBefore,
  handleFirst,
  handleLast,
  handleAfter,
  handleReplace
} from 'modules/workspace/containers/ClipboardControls/actions';
import {
  setSelectedKey,
  resetSelectedKeys,
  setSelectedParentKey,
  setHighlightSelectedKey
} from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import {
  cloneSelected,
  deleteSelected
} from 'modules/workspace/containers/SelectionControls/actions';
import { pushHistory, popHistory } from 'modules/workspace/containers/HistoryControls/actions';

export const SET_PAGES = 'DeskPage/SET_PAGES';
export const RELOAD_PAGE = 'DeskPage/RELOAD_PAGE';
export const LOAD_PAGE = 'DeskPage/LOAD_PAGE';
export const PAGE_LOADED = 'DeskPage/PAGE_LOADED';
export const PAGE_LOAD_TIMEOUT = 'DeskPage/PAGE_LOAD_TIMEOUT';
export const CHANGE_PAGE_ROUTE = 'DeskPage/CHANGE_PAGE_ROUTE';
export const SET_LIVE_PREVIEW_MODE_ON = 'DeskPage/SET_LIVE_PREVIEW_MODE_ON';
export const SET_EDIT_MODE_ON = 'DeskPage/SET_EDIT_MODE_ON';
export const SET_RELOAD_PAGE_REQUEST = 'DeskPage/SET_RELOAD_PAGE_REQUEST';
export const EXECUTE_RELOAD_PAGE_REQUEST = 'DeskPage/EXECUTE_RELOAD_PAGE_REQUEST';
export const CHANGE_PAGE_ROUTE_FEEDBACK = 'DeskPage/CHANGE_PAGE_ROUTE_FEEDBACK';
export const UPDATE_PAGE = 'DeskPage/UPDATE_PAGE';
export const UPDATE_MARKED = 'DeskPage/UPDATE_MARKED';
export const SAVE_MODEL = 'DeskPage/SAVE_MODEL';

export const setPages = (pages) => ({type: SET_PAGES, payload: pages});
export const reloadPage = () => ({type: RELOAD_PAGE});
export const loadPage = () => ({type: LOAD_PAGE});
export const pageLoaded = () => ({type: PAGE_LOADED});
export const pageLoadTimeout = () => ({type: PAGE_LOAD_TIMEOUT});
export const setReloadPageRequest = () => ({type: SET_RELOAD_PAGE_REQUEST});
export const executeReloadPageRequest = () => ({type: EXECUTE_RELOAD_PAGE_REQUEST});

export const updatePage = () => ({type: UPDATE_PAGE});
export const updateMarked = () => ({type: UPDATE_MARKED});
export const saveModel = () => ({type: SAVE_MODEL});

export const setLivePreviewModeOn = () => (dispatch, getState) => {
  coockiesApi.saveDeskSettings({isEditModeOn: false});
  dispatch({type: SET_LIVE_PREVIEW_MODE_ON});
};
export const setEditModeOn = () => (dispatch, getState) => {
  coockiesApi.saveDeskSettings({isEditModeOn: true});
  dispatch({type: SET_EDIT_MODE_ON});
};

export const changePageRoute = (pagePath) => (dispatch, getState) => {
  coockiesApi.saveDeskSettings({currentPagePath: pagePath});
  dispatch({type: CHANGE_PAGE_ROUTE, payload: pagePath});
};

export const changePageRouteFeedback = (pathname) => (dispatch, getState) => {
  dispatch({type: CHANGE_PAGE_ROUTE_FEEDBACK, payload: pathname});
};

export const loadModel = (model) => (dispatch, getState) => {
  let {pages} = model;
  // force to have at least one page
  if (!pages || pages.length <= 0) {
    let pageModel = utilsStore.getTemplatePageModel();
    model.pages = [pageModel];
  }
  graphApi.initGraph(model);
  let pageList = graphApi.getPages();
  dispatch(setPages(pageList));

  const deskSettings = coockiesApi.getDeskSettings();
  if (deskSettings &&
    deskSettings.currentPagePath &&
    pageList.findIndex(i => i.pagePath === deskSettings.currentPagePath) >= 0) {
    dispatch(changePageRouteFeedback(deskSettings.currentPagePath));
  } else {
    dispatch(changePageRouteFeedback(pageList[0].pagePath));
  }
};

export const addNewPage = (pageName, pagePath) => (dispatch, getState) => {
  try {
    dispatch(pushHistory());
    let pageModel = utilsStore.getTemplatePageModel();
    let pageList = graphApi.addNewPage(pageModel, pagePath, pageName);
    dispatch(setPages(pageList));
    dispatch(changePageRouteFeedback(pageList[pageList.length - 1].pagePath));
    dispatch(reloadPage());
    dispatch(saveModel());
    dispatch(success('New page was added successfully'));
  } catch (e) {
    dispatch(failed(e.message ? e.message : e));
  }
};

export const clonePage = (pageName, pagePath) => (dispatch, getState) => {
  try {
    dispatch(pushHistory());
    const {deskPage: {currentPagePath}} = getState();
    let pageList = graphApi.duplicatePage(currentPagePath, pagePath, pageName);
    dispatch(setPages(pageList));
    dispatch(changePageRouteFeedback(pageList[pageList.length - 1].pagePath));
    dispatch(reloadPage());
    dispatch(saveModel());
    dispatch(success('Page was cloned successfully'));
  } catch (e) {
    dispatch(failed(e.message ? e.message : e));
  }
};

export const changePageOptions = (pageName, pagePath) => (dispatch, getState) => {

  const {deskPage: {currentPagePath, currentPageName}} = getState();
  try {
    if (pagePath !== currentPagePath || pageName !== currentPageName) {
      dispatch(pushHistory());
      let pageList;
      let firstChar = pageName.charAt(0).toUpperCase();
      pageName = firstChar + pageName.substr(1);
      pageList = graphApi.changePagePathAndName(currentPagePath, pagePath, pageName);
      if (pageList) {
        dispatch(setPages(pageList));
        dispatch(changePageRouteFeedback(pagePath));
        dispatch(reloadPage());
        dispatch(saveModel());
        dispatch(success('Page options were changed successfully.'));
      }
    }
  } catch (e) {
    dispatch(failed(e.message ? e.message : e));
  }
};

export const setIndexPage = () => (dispatch, getState) => {
  try {
    dispatch(pushHistory());
    const {deskPage: {currentPagePath}} = getState();
    let pageList = graphApi.setIndexPage(currentPagePath);
    if (pageList) {
      dispatch(setPages(pageList));
      dispatch(reloadPage());
      dispatch(saveModel());
      dispatch(success('Route ' + currentPagePath + ' now is the index route.'));
    }
  } catch (e) {
    dispatch(failed(e.message ? e.message : e));
  }
};

export const deletePage = () => (dispatch, getState) => {
  try {
    dispatch(pushHistory());
    const {deskPage: {currentPagePath, currentPageIndex}} = getState();
    let pageList = graphApi.deletePage(currentPagePath);
    if (pageList) {
      dispatch(setPages(pageList));
      if (currentPageIndex === 0) {
        dispatch(changePageRouteFeedback(pageList[0].pagePath));
      } else if (currentPageIndex > 0) {
        dispatch(changePageRouteFeedback(pageList[currentPageIndex - 1].pagePath));
      }
      dispatch(resetClipboardKeys());
      dispatch(resetSelectedKeys());
      dispatch(reloadPage());
      dispatch(saveModel());
      dispatch(success('Route path ' + currentPagePath + ' were deleted successfully'));
    }
  } catch (e) {
    dispatch(failed(e.message ? e.message : e));
  }
};

export const resetPages = () => (dispatch, getState) => {
  let pageList = graphApi.getPages();
  dispatch(setPages(pageList));
};

export const containerActions = (dispatch) => bindActionCreators({
  loadPage,
  pageLoaded,
  setSelectedKey,
  setSelectedParentKey,
  changePageRouteFeedback,
  setForCuttingKeys,
  setForCopyingKeys,
  handleBefore,
  handleFirst,
  handleLast,
  handleAfter,
  handleReplace,
  cloneSelected,
  deleteSelected,
  popHistory,
  setHighlightSelectedKey
}, dispatch);
