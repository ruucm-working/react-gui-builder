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
    tasks: new Map()
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if(type === actions.STARTED) {
        let status = state.tasks.get(payload);
        if(status){
            status.stage = 'started';
            status.counter += 1;
        } else {
            status = {
                stage: 'started',
                counter: 1
            }
        }
        state = Object.assign({}, state);
        state.tasks.set(payload, status);
        return state;
    }
    if(type === actions.DONE) {
        let status = state.tasks.get(payload);
        if(status) {
            state = Object.assign({}, state);
            if(status.counter > 1){
                status.counter -= 1;
                state.tasks.set(payload, status);
            } else {
                state.tasks.delete(payload);
            }
        } else {
            console.warn('AppSpinner: some process tried to call DONE action for ' + payload + ' which was not started before.');
        }
        return state;
    }

    return state;
}

