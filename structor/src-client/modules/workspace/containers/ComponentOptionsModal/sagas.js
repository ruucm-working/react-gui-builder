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

import { fork, take, call, put, race, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import { serverApi, graphApi } from 'api';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import { updatePage } from 'modules/workspace/containers/DeskPage/actions';
import { setSelectedKey } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* delaySaveComponentSourceCode(){
    try{
        yield call(delay, 10000);
        yield put(messageActions.timeout('Saving source code is timed out. Check the console output for errors.'));
        yield put(actions.setReloadPageRequest());
        yield put(actions.saveSourceCodeTimeout());
    } catch(e){
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* saveComponentSourceCode(options){
    try {
        const {key, sourcePropsObj, text, sourceCode, sourceFilePath} = options;
        let node = graphApi.getNode(key);
        if (node) {
            if(sourceCode && sourceFilePath){
                yield call(serverApi.writeComponentSource, sourceFilePath, sourceCode);
            }
            yield put(pushHistory());
            node.modelNode.props = sourcePropsObj;
            node.modelNode.text = text;
            yield put(setSelectedKey(key));
            yield put(updatePage());
            yield put(actions.hideModal());
        } else {
            yield put(messageActions.failed('Saving source code error. Error: component with key ' + key + ' was not found.'));
        }
        yield put(actions.saveSourceCodeDone());
    } catch (error) {
        console.error(error);
        if (error instanceof SagaCancellationException) {
            // do nothing
        } else {
            yield put(messageActions.failed('Saving source code error. Error: ' + (error.message ? error.message : error)));
            yield put(actions.saveSourceCodeDone());
        }
    }
}

function* saveSourceCode(){
    while(true){
        const { payload } = yield take(actions.SAVE_SOURCE_CODE);
        yield put(spinnerActions.started('Saving source code'));
        const saveTask = yield fork(saveComponentSourceCode, payload);
        const delayTask = yield fork(delaySaveComponentSourceCode);
        yield take([actions.SAVE_SOURCE_CODE_DONE, actions.SAVE_SOURCE_CODE_TIMEOUT]);
        yield cancel(saveTask);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Saving source code'));
    }
}

function* loadComponentOptions(componentName, namespace, sourceFilePath){
    try{
        return yield call(serverApi.loadComponentOptions, componentName, namespace, sourceFilePath);
    } catch(error){
        if(error instanceof SagaCancellationException){
            yield put(messageActions.failed('Loading component options was canceled.'));
        } else {
            yield put(messageActions.failed('Loading component options error. Error: ' + (error.message ? error.message : error)));
        }
    }
}

function* loadOptionsAndShowModal(){
    while(true){
        const { payload } = yield take(actions.LOAD_OPTIONS_AND_SHOW_MODAL);
        yield put(spinnerActions.started('Loading component options'));
        try {
            const {sourceFilePath, componentName, namespace} = payload;
            const {timeout, response} = yield race({
                response: call(loadComponentOptions, componentName, namespace, sourceFilePath),
                timeout: call(delay, 10000)
            });
            if(response){
                yield put(actions.setOptions({...payload, ...response}));
                yield put(actions.showModal());
            } else if(timeout) {
                yield put(messageActions.timeout('Loading component options is timed out.'));
            }
        } catch(error) {
            yield put(messageActions.failed('Loading component options error. Error: ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading component options'));
    }
}

// main saga
export default function* mainSaga() {
    yield [fork(saveSourceCode), fork(loadOptionsAndShowModal)];
};
