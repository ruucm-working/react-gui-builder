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
import { serverApi } from 'api';
import * as actions from './actions.js';
import * as messageActions from 'modules/app/containers/AppMessage/actions';

function* loadReadmeText(){
  while(true){
    const { payload } = yield take(actions.LOAD_README_TEXT);
    try {
      const {componentName, namespace} = payload;
      const componentNotes = yield call(serverApi.loadComponentNotes, componentName, namespace);
      yield put(actions.setReadmeText(componentNotes.readmeText, componentNotes.propNames));
    } catch(error) {
      yield put(messageActions.failed('Loading readme. Error: ' + (error.message ? error.message : error)));
    }
  }
}

// main saga
export default function* mainSaga() {
    yield [fork(loadReadmeText)];
};
