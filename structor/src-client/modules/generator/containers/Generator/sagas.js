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

function* pregenerate(){
    while(true){
        const {payload: {
            generatorName, generatorDirPath, namespace, componentName, modelNode
        }} = yield take(actions.PREGENERATE);
        yield put(spinnerActions.started('Retrieving metadata'));
        try {
            const pregeneratedData =
                yield call(
                    serverApi.pregenerate,
                    generatorName,
                    generatorDirPath,
                    namespace,
                    componentName,
                    modelNode
                );
            yield put(actions.setComponentMetadata(pregeneratedData.metaData, pregeneratedData.metaHelp));
            yield put(actions.stepToStage(actions.STAGE3));
            let recentGenerators = coockiesApi.addToRecentGenerators(generatorName);
            yield put(generatorListActions.setRecentGenerators(recentGenerators));
        } catch(error) {
            yield put(messageActions.failed('Metadata retrieving has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Retrieving metadata'));
    }
}

function* generate(){
    while(true){
        const {payload: {
            generatorName, generatorDirPath, namespace, componentName, modelNode, metaData
        }} = yield take(actions.GENERATE);
        yield put(spinnerActions.started('Generating the source code'));
        try {
            const generatedData = yield call(
                serverApi.generate,
                generatorName,
                generatorDirPath,
                namespace,
                componentName,
                modelNode,
                metaData
            );
            yield put(actions.setGeneratedData(generatedData));
            yield put(actions.stepToStage(actions.STAGE4));
        } catch(error) {
            yield put(messageActions.failed('The source code generation has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Generating the source code'));
    }
}

function* saveGenerated(){
    while(true){
        const {payload: {selectedKey, newModelNode, files, dependencies}} = yield take(actions.SAVE_GENERATED);
        yield put(spinnerActions.started('Installing & saving the source code'));
        try {
            yield call(serverApi.saveGenerated, files, dependencies);
            graphApi.changeModelNodeType(selectedKey, newModelNode);
            yield put(clipboardIndicatorActions.removeClipboardKeys());
            yield put(selectionBreadcrumbsActions.setSelectedKey(selectedKey));
            yield put(libraryPanelActions.loadComponents());
            yield put(deskPageActions.setReloadPageRequest());
            yield put(actions.hide());
            yield put(historyActions.pushHistory());
        } catch(error) {
            yield put(messageActions.failed('Source code installation has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Installing & saving the source code'));
    }
}

function* loadGenerators(){
    while(true){
        yield take(actions.LOAD_GENERATORS);
        yield put(spinnerActions.started('Loading generators'));
        try {
            let generatorsList = yield call(serverApi.getAvailableGeneratorsList);
            const recentGenerators = coockiesApi.getRecentGenerators();
            yield put(generatorListActions.setGenerators(generatorsList));
            yield put(generatorListActions.setRecentGenerators(recentGenerators));
            yield put(appContainerActions.showGenerator());
        } catch(error) {
            yield put(messageActions.failed('Generators loading has an error. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Loading generators'));
    }
}

// main saga
export default function* mainSaga() {
    yield fork(loadGenerators);
    // yield fork(loadAllGenerators);
    yield fork(pregenerate);
    yield fork(generate);
    // yield fork(remove);
    yield fork(saveGenerated);
};
