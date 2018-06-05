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

import * as actions from './actions.js';

const initialState = {
    messages: new Map()
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if( type === actions.SUCCESS || type === actions.FAILED || type === actions.TIMEOUT ) {
        state = Object.assign({}, state);
        state.messages.set(payload.timestamp, {
            text: payload.text,
            type: type
        });
        return state;
    }
    if(type === actions.CLOSE) {
        state = Object.assign({}, state);
        state.messages.delete(payload);
        return state;
    }

    return state;
}

