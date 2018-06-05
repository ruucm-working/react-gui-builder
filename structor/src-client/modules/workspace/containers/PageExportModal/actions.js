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

import { forOwn } from 'lodash';
import { bindActionCreators } from 'redux';
import { exportPages, exportApplication } from 'modules/workspace/containers/PageExportControls/actions';

export const SHOW_MODAL = "PageExportModal/SHOW_MODAL";
export const HIDE_MODAL = "PageExportModal/HIDE_MODAL";
export const TOGGLE_ROUTE_SELECTION = "PageExportModal/TOGGLE_ROUTE_SELECTION";

export const showPageExportModal = (exportMode) => ({type: SHOW_MODAL, payload: {exportMode}});
export const hidePageExportModal = () => ({type: HIDE_MODAL});
export const toggleRouteSelection = (path) => ({type: TOGGLE_ROUTE_SELECTION, payload: {path}});
export const submitPageExport = (pages, selectedRoutes, exportMode) => (dispatch, getState) => {
  let result = [];
  pages = pages || [];
  let filteredPages;
  forOwn(selectedRoutes, (value, prop) => {
    if (value === true) {
      filteredPages = pages.filter(page => page.pagePath === prop);
      if (filteredPages && filteredPages.length > 0) {
        result = result.concat(filteredPages);
      }
    }
  });
	if (exportMode === 'pages') {
		dispatch(exportPages(result));
	} else {
		dispatch(exportApplication(result));
	}
	dispatch(hidePageExportModal());
};


export const containerActions = (dispatch) => bindActionCreators({
	hidePageExportModal, submitPageExport, toggleRouteSelection
}, dispatch);
