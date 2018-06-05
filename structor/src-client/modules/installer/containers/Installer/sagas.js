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

import {fork, take, call, put, cancel} from 'redux-saga/effects';
import {SagaCancellationException} from 'redux-saga';
import {serverApi} from 'api';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import * as deskPageActions from 'modules/workspace/containers/DeskPage/actions';
import * as libraryPanelActions from 'modules/workspace/containers/LibraryPanel/actions';
import * as appContainerActions from 'modules/app/containers/AppContainer/actions';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* getMarketIndexList() {
	while (true) {
		yield take(actions.GET_MARKET_INDEX_LIST);
		yield put(spinnerActions.started('Loading packages'));
		try {
			const indexList = yield call(serverApi.getMarketList);
			yield put(actions.setMarketIndexList(indexList));
		} catch (error) {
			yield put(messageActions.failed('Loading packages. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Loading packages'));
	}
}

// function* getMarketRepos(indexList) {
// 	if (indexList && indexList.length > 0) {
// 		for (let i = 0; i < indexList.length; i++) {
// 			const {gitHubRepo, gitHubOwner} = indexList[i];
// 			yield put(actions.getMarketRepoInfo(i, gitHubRepo, gitHubOwner));
// 			try {
// 				const repoData = yield call(serverApi.getGHRepoInfo, gitHubRepo, gitHubOwner);
// 				yield put(actions.setMarketRepoInfo(i, repoData));
// 			} catch (error) {
// 				yield put(messageActions.failed('Loading GH repo info. ' + (error.message ? error.message : error)));
// 			}
// 		}
// 	}
// }

function* installNamespaces() {
	while (true) {
		const {payload: {namespacesSrcDirPath}} = yield take(actions.INSTALL_NAMESPACES);
		yield put(spinnerActions.started('Installing namespaces'));
		try {
			yield call(serverApi.installFromLocalDir, namespacesSrcDirPath);
			yield call(delay, 10000);
      const model = yield call(serverApi.getProjectModel);
      yield put(deskPageActions.loadModel(model || {}));
			yield put(appContainerActions.hideInstaller());
			yield put(deskPageActions.reloadPage());
			yield put(messageActions.success('Namespaces have been installed successfully.'));
		} catch (error) {
			yield put(messageActions.failed('Installing namespaces. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Installing namespaces'));
	}
}

function* cancelInstall() {
	while (true) {
		yield take(actions.CANCEL_INSTALL_NAMESPACES);
		yield put(spinnerActions.started('Clean temp data'));
		try {
			yield call(serverApi.cancelInstall);
		} catch (error) {
			yield put(messageActions.failed('Clean temp data. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Clean temp data'));
	}
}

function* preInstallNamespaces() {
	while (true) {
		const {payload: {dirPath, url}} = yield take(actions.PRE_INSTALL_NAMESPACES);
		yield put(spinnerActions.started('Checking the source'));
		try {
			let installationOptions;
			if (dirPath) {
				installationOptions = yield call(serverApi.preInstallFromLocalDir, dirPath);
			} else if (url) {
				installationOptions = yield call(serverApi.preInstallFromUrl, url);
			}
			yield put(actions.install(installationOptions));
		} catch (error) {
			yield put(messageActions.failed('Checking the source. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Checking the source'));
	}
}

// main saga
export default function* mainSaga() {
	yield fork(getMarketIndexList);
	yield fork(preInstallNamespaces);
	yield fork(installNamespaces);
	yield fork(cancelInstall);
};
