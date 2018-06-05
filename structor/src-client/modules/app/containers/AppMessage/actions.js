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
import {showModal} from 'modules/app/containers/InformationModal/actions';

let messageCounter = 0;

export const SUCCESS = "AppMessage/SUCCESS";
export const FAILED = "AppMessage/FAILED";
export const TIMEOUT = "AppMessage/TIMEOUT";

export const CLOSE = "AppMessage/CLOSE";

export const success = (text, timeout = 3000) => ({ type: SUCCESS, payload: {text, timeout, timestamp: Date.now() + ++messageCounter} });
export const failed = (text) => ({ type: FAILED, payload: {text, timestamp: Date.now() + ++messageCounter} });
export const timeout = (text) => ({ type: TIMEOUT, payload: {text, timestamp: Date.now() + ++messageCounter} });
export const close = (key) => ({ type: CLOSE, payload: key });

export const containerActions = (dispatch) => bindActionCreators({
    success, failed, timeout, close, showModal
}, dispatch);