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

import {forOwn, isObject} from 'lodash';
import {invokeStructor} from './restApi.js';

export function getProjectStatus() {
	return invokeStructor('getProjectStatus', {});
}

export function getProjectInfo() {
	return invokeStructor('getConfig');
}

export function getProjectModel() {
	return invokeStructor('getModel');
}

export function saveProjectModel(model) {
	return invokeStructor('saveProjectModel', {model: model});
}

export function exportProjectModel(model) {
	return invokeStructor('saveProjectModel', {model: model}).then(() => {
		return invokeStructor('exportPages', {model: model});
	});
}

export function setProxyURL(proxyURL) {
	return invokeStructor('setProxyURL', {proxyURL});
}

export function loadComponentTree() {
	return invokeStructor('getComponentTree', {})
}

export function loadComponentOptions(componentName, namespace, sourceCodeFilePath) {
	let result = {};
	return invokeStructor('getComponentNotes', {componentName, namespace})
		.then(response => {
			result.readmeText = response.readmeText;
			if (sourceCodeFilePath) {
				return invokeStructor('getComponentSourceCode', {filePath: sourceCodeFilePath})
					.then(response => {
						result.sourceCode = response;
						return result;
					});
			} else {
				return result;
			}
		});
}

export function loadComponentNotes(componentName, namespace) {
  return invokeStructor('getComponentNotes', {componentName, namespace});
}

export function writeComponentSource(sourceCodeFilePath, sourceCode) {
	return invokeStructor('writeComponentSourceCode', {filePath: sourceCodeFilePath, sourceCode});
}

export function writeComponentDefaults(componentName, namespace, defaults) {
	return invokeStructor('writeComponentDefaults', {componentName, namespace, defaults});
}

export function getAvailableGeneratorsList() {
	return invokeStructor('getScaffoldGenerators');
}

export function pregenerate(generatorName,
							generatorDirPath,
							namespace,
							componentName,
							model) {
	return invokeStructor(
		'pregenerate',
		{generatorName, generatorDirPath, namespace, componentName, model}
	);
}
export function generate(generatorName,
						 generatorDirPath,
						 namespace,
						 componentName,
						 model,
						 metadata) {
	return invokeStructor(
		'generate',
		{generatorName, generatorDirPath, namespace, componentName, model, metadata}
	);
}

export function saveGenerated(files, dependencies) {
	return invokeStructor('saveGenerated', {files, dependencies});
}

export function generateApplication(pagesModel, hasApplicationFiles) {
    return invokeStructor('generateApplication', {pagesModel, hasApplicationFiles});
}

export function preExtractNamespaces(namespaces, pages) {
	return invokeStructor('preExtractNamespaces', {namespaces, pages});
}

export function extractNamespaces(namespaces, dependencies, pages, dirPath) {
	return invokeStructor('extractNamespaces', {namespaces, dependencies, pages, dirPath});
}

export function getMarketList() {
	return invokeStructor('getMarketList', {});
}

export function getGHRepoInfo(gitHubRepo, gitHubOwner) {
	return invokeStructor('getGHRepoInfo', {gitHubRepo, gitHubOwner});
}

export function preInstallFromLocalDir(dirPath) {
	return invokeStructor('preInstall', {dirPath});
}

export function preInstallFromUrl(url) {
	return invokeStructor('preInstall', {url});
}

export function cancelInstall() {
	return invokeStructor('cancelInstall', {});
}

export function installFromLocalDir(dirPath) {
	return invokeStructor('installFromLocalDir', {dirPath});
}
