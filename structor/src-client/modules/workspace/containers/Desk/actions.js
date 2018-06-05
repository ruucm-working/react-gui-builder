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

export const CHANGE_VIEWPORT_WIDTH = 'Desk/CHANGE_VIEWPORT_WIDTH';
export const TOGGLE_LIBRARY_PANEL = 'Desk/TOGGLE_LIBRARY_PANEL';
export const TOGGLE_PAGELIST_PANEL = 'Desk/TOGGLE_PAGELIST_PANEL';
export const TOGGLE_PAGE_TREEVIEW = 'Desk/TOGGLE_PAGE_TREEVIEW';
export const TOGGLE_QUICK_OPTIONS = 'Desk/TOGGLE_QUICK_OPTIONS';
export const SET_BOTTOM_PANEL_HEIGHT = 'Desk/SET_BOTTOM_PANEL_HEIGHT';
export const TOGGLE_BOTTOM_PANEL_INSERTION_MODE = 'Desk/TOGGLE_BOTTOM_PANEL_INSERTION_MODE';
export const TOGGLE_BOTTOM_RIGHT_PANEL = 'Desk/TOGGLE_BOTTOM_RIGHT_PANEL';
export const UPDATE_DESK_LAYOUT = 'Desk/UPDATE_DESK_LAYOUT';

export const MAX_BOTTOM_PANEL_HEIGHT = 450;
export const MIN_BOTTOM_PANEL_HEIGHT = 200;
//export const

export const togglePageTreeview = () => ({type: TOGGLE_PAGE_TREEVIEW});
export const toggleQuickOptions = () => ({type: TOGGLE_QUICK_OPTIONS});
export const togglePageListPanel = () => ({type: TOGGLE_PAGELIST_PANEL});
export const changeViewportWidth = (width) => ({type: CHANGE_VIEWPORT_WIDTH, payload: width});
export const toggleLibraryPanel = () => ({type: TOGGLE_LIBRARY_PANEL});
export const setBottomPanelHeight = (height) => ({type: SET_BOTTOM_PANEL_HEIGHT, payload: height});
export const toggleBottomPanelInsertionMode = () => ({type: TOGGLE_BOTTOM_PANEL_INSERTION_MODE});
export const toggleBottomRightPanel = () => ({type: TOGGLE_BOTTOM_RIGHT_PANEL});
export const updateDeskLayout = (options) => ({type: UPDATE_DESK_LAYOUT, payload: options});

export const containerActions = (dispatch) => bindActionCreators({
  changeViewportWidth,
  togglePageTreeview,
  setBottomPanelHeight,
  toggleBottomPanelInsertionMode,
  toggleBottomRightPanel,
}, dispatch);