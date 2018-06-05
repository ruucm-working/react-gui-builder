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
import { installFromDir } from 'modules/installer/containers/Installer/actions';

export const HIDE_MODAL = 'SelectDirectoryModal/HIDE_MODAL';
export const SHOW_MODAL = 'SelectDirectoryModal/SHOW_MODAL';
export const SUBMIT_MODAL = 'SelectDirectoryModal/SUBMIT_MODAL';

export const hideModal = () => ({type: HIDE_MODAL});
export const showModal = () => (dispatch, getState) => {
  const recentDirPaths = coockiesApi.getRecentInstallerDirPaths();
  dispatch({type: SHOW_MODAL, payload: {recentDirPaths}});
};
export const submitModal = (dirPath) => (dispatch, getState) => {
  coockiesApi.addToRecentInstallerDirPaths(dirPath);
  dispatch({type: SUBMIT_MODAL, payload: {dirPath}});
  dispatch(installFromDir(dirPath));
};

export const containerActions = (dispatch) => bindActionCreators({
  hideModal, submitModal
}, dispatch);
