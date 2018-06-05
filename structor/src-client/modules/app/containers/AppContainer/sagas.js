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

import { SagaCancellationException } from 'redux-saga';
import { fork, take, call, put, race, cancel } from 'redux-saga/effects';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import * as deskPageActions from 'modules/workspace/containers/DeskPage/actions';
import * as libraryPanelActions from 'modules/workspace/containers/LibraryPanel/actions';
import { serverApi } from 'api';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* delayForCompiler(){
    try{
        yield call(delay, 300000);
        yield put(messageActions.timeout('The source code compiling is timed out. Look at console output or reload the browser page.'));
        yield put(deskPageActions.setReloadPageRequest());
        yield put(actions.compilerTimeout());
    } catch(e) {
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* waitForCompiler(){
    while(true){
        yield take(actions.COMPILER_START);
        yield put(spinnerActions.started('Compiling the source code'));
        const delayTask = yield fork(delayForCompiler);
        yield take([actions.COMPILER_DONE, actions.COMPILER_TIMEOUT]);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Compiling the source code'));
    }
}

function* getProjectStatus(){
    while(true){
        yield take(actions.GET_PROJECT_STATUS);
        yield put(spinnerActions.started('Loading project'));
        try{
            // yield call(signInByToken);
            const status = yield call(serverApi.getProjectStatus);
            if(status === 'ready-to-go'){
                const model = yield call(serverApi.getProjectModel);
                yield put(libraryPanelActions.loadComponents());
                yield put(deskPageActions.loadModel(model || {}));

                const projectInfo = yield call(serverApi.getProjectInfo);
                yield put(actions.setProjectInfo(projectInfo));

                yield put(actions.showDesk());
                yield put(actions.setupDesk());
            } else {
                yield put(messageActions.failed('Loading error of the current project'));
            }
        } catch(error) {
            yield put(messageActions.failed('Obtaining project status error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading project'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(getProjectStatus);
    yield fork(waitForCompiler)
};
