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

export const HIDE_MODAL = "InformationModal/HIDE_MODAL";
export const SHOW_MODAL = "InformationModal/SHOW_MODAL";

export const hideModal = () => ({type: HIDE_MODAL});
export const showModal = (message, close) => ({type: SHOW_MODAL, payload: {message, close}});

export const containerActions = (dispatch) => bindActionCreators({
    hideModal
}, dispatch);
