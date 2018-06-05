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

import validator from 'validator';
import { bindActionCreators } from 'redux';
import {
    changePageOptions,
    setIndexPage,
    clonePage,
    addNewPage
} from 'modules/workspace/containers/DeskPage/actions';
import { success, failed, timeout, close} from 'modules/app/containers/AppMessage/actions';

export const CHANGE_OPTIONS = 1;
export const ADD_NEW = 2;
export const DUPLICATE = 3;

export const HIDE_MODAL = "PageOptionsModal/HIDE_MODAL";
export const SHOW_MODAL = "PageOptionsModal/SHOW_MODAL";

export const hideModal = () => ({type: HIDE_MODAL});
export const showModal = (mode) => ({type: SHOW_MODAL, payload: mode});

export const change = (options, mode) => (dispatch, getState) => {

    let {pageName, pagePath, makeIndexRoute} = options;
    const {deskPage: {pages}} = getState();

    var firstChar = pageName.charAt(0).toUpperCase();
    pageName = firstChar + pageName.substr(1);

    if (!pageName || pageName.length <= 0 || !validator.isAlphanumeric(pageName)) {
        dispatch(failed('Please enter alphanumeric value for page component name'));
    } else if (!pagePath || pagePath.length <= 0 || pagePath.charAt(0) !== '/') {
        dispatch(failed('Please enter non empty value for route path which starts with \'/\' character'));
    } else {
        //console.log('Mode is: ' + mode);
        if (mode === CHANGE_OPTIONS) {
            dispatch(changePageOptions(pageName, pagePath));
            if (makeIndexRoute) {
                dispatch(setIndexPage());
            }
            dispatch(hideModal());
        } else if (mode === ADD_NEW) {
            let existingPages;
            if (pages && pages.length > 0) {
                existingPages = pages.filter(p => p.pagePath === pagePath);
            }
            if (!existingPages || existingPages.length <= 0) {
                dispatch(addNewPage(pageName, pagePath));
                if (makeIndexRoute) {
                    dispatch(setIndexPage());
                }
                dispatch(hideModal());
            } else {
                dispatch(failed('There is already the page with equal path.'))
            }
        } else if (mode === DUPLICATE) {
            let existingPages;
            if (pages && pages.length > 0) {
                existingPages = pages.filter(p => p.pagePath === pagePath);
            }
            if (!existingPages || existingPages.length <= 0) {
                dispatch(clonePage(pageName, pagePath));
                if (makeIndexRoute) {
                    dispatch(setIndexPage());
                }
                dispatch(hideModal());
            } else {
                dispatch(failed('There is already the page with equal path.'))
            }
        }
    }
};

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, change
}, dispatch);
