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

import { fork, take, call, put, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import * as generatorListActions from 'modules/generator/containers/GeneratorList/actions';
import * as appContainerActions from 'modules/app/containers/AppContainer/actions';
import * as deskPageActions from 'modules/workspace/containers/DeskPage/actions';
import * as clipboardIndicatorActions from 'modules/workspace/containers/ClipboardIndicator/actions';
import * as libraryPanelActions from 'modules/workspace/containers/LibraryPanel/actions';
import * as selectionBreadcrumbsActions from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import { serverApi, graphApi, coockiesApi } from 'api';
import * as historyActions from 'modules/workspace/containers/HistoryControls/actions';

function* preExtract () {
  while (true) {
    const {payload: {namespaces, pages}} = yield take(actions.PREEXTRACT);
    yield put(spinnerActions.started('Searching dependencies'));
    try {
      const preExtractedData = yield call(serverApi.preExtractNamespaces, namespaces, pages);
      yield put(actions.setPreExtractedData(preExtractedData));
      yield put(actions.stepToStage(actions.STAGE2));
    } catch (error) {
      yield put(messageActions.failed((error.message ? error.message : error)));
    }
    yield put(spinnerActions.done('Searching dependencies'));
  }
}

function* extract () {
  while (true) {
    const {payload: {namespaces, dependencies, pages, dirPath}} = yield take(actions.EXTRACT);
    yield put(spinnerActions.started('Extracting the source code'));
    try {
      yield call(
        serverApi.extractNamespaces,
        namespaces,
        dependencies,
        pages,
        dirPath
      );
      yield put(actions.hide());
      yield put(
        messageActions.success(
          'The source code has been extracted successfully. Find extracted namespaces in ' + dirPath
        )
      );
    } catch (error) {
      yield put(
        messageActions.failed(
          'Extracting the source code. ' + (error.message ? error.message : error)
        )
      );
    }
    yield put(spinnerActions.done('Extracting the source code'));
  }
}

// main saga
export default function* mainSaga () {
  yield fork(preExtract);
  yield fork(extract);
};
