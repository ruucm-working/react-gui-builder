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

//import validator from 'validator';
//import { SagaCancellationException } from 'redux-saga';
//import { fork, take, call, put, race } from 'redux-saga/effects';
//import * as actions from './actions.js';
//import * as spinnerActions from '../AppSpinner/actions.js';
//import * as messageActions from '../AppMessage/actions.js';
////import * as deskActions from '../../workspace/Desk/actions.js';
//import * as deskPageActions from '../../workspace/DeskPage/actions.js';
//import { loadComponents } from '../../workspace/LibraryPanel/actions.js';
//import { serverApi, cookies } from '../../../api';
//
//const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));
//
//function* signInByToken(){
//    let tokenFromCookies = cookies.getItem("structor-market-token");
//    if (tokenFromCookies) {
//        try{
//            const userCredentials = yield call(serverApi.initUserCredentialsByToken, tokenFromCookies);
//            yield put(actions.signInDone(userCredentials));
//        } catch(e){
//            console.warn(e.message ? e.message : e.toString());
//        }
//    }
//}
//
//function* signIn(){
//    while(true){
//        const {payload: {email, password, staySignedIn}} = yield take(actions.SIGN_IN);
//        if(!email || email.length <= 0){
//            put(actions.signInFailed('Please enter e-mail address value'));
//        } else if( !validator.isEmail(email) ){
//            put(actions.signInFailed('Please enter valid e-mail address value'));
//        } else {
//            yield put(spinnerActions.started(actions.SIGN_IN));
//            try{
//                const response = yield call(serverApi.initUserCredentials, email, password);
//                if(staySignedIn === true){
//                    docCookies.setItem("structor-market-token", response.token, 31536e3, "/");
//                }
//                yield put(actions.signInDone(response))
//            } catch(e){
//                yield put(actions.signInFailed(e));
//            }
//            yield put(spinnerActions.done(actions.SIGN_IN));
//        }
//    }
//}
//
//function* loadProjectInfo(){
//    try{
//        return yield call(serverApi.getProjectInfo);
//    } catch(error){
//        if(error instanceof SagaCancellationException){
//            yield put(messageActions.failed('Project initialization canceled.'));
//        } else {
//            yield put(messageActions.failed('Project initialization error. ' + (error.message ? error.message : error)));
//        }
//    }
//}
//
//function* loadProject(){
//    yield take(actions.GET_PROJECT_INFO);
//    try {
//        yield put(spinnerActions.started('Loading project'));
//        yield call(signInByToken);
//        const {timeout, response} = yield race({
//            response: call(loadProjectInfo),
//            timeout: call(delay, 30000)
//        });
//        if(response){
//            const {projectData: {model}, packageConfig, projectDirectoryStatus} = response;
//
//            yield put(deskPageActions.loadModel(model));
//            yield put(actions.getProjectInfoDone({packageConfig, projectDirectoryStatus}));
//            yield put(loadComponents());
//
//        } else if(timeout) {
//            yield put(messageActions.timeout('Project initialization timeout.'));
//        }
//    } catch(error) {
//        yield put(messageActions.failed('Project loading error. ' + (error.message ? error.message : error)));
//    }
//    yield put(spinnerActions.done('Loading project'));
//}

// main saga
export default function* mainSaga() {
    //yield [fork(loadProject)];

};
