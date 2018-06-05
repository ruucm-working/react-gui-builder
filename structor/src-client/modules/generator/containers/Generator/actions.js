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

import validator from 'validator';
import {bindActionCreators} from 'redux';
import {hideGenerator} from 'modules/app/containers/AppContainer/actions';
import {failed} from 'modules/app/containers/AppMessage/actions';

export const STAGE1 = 'STAGE1';
export const STAGE2 = 'STAGE2';
export const STAGE3 = 'STAGE3';
export const STAGE4 = 'STAGE4';

export const STEP_TO_STAGE = "Generator/STEP_TO_STAGE";
export const LOAD_GENERATORS = "Generator/LOAD_GENERATORS";
export const SET_GENERATED_DATA = "Generator/SET_GENERATED_DATA";
export const PREGENERATE = "Generator/PREGENERATE";
export const GENERATE = "Generator/GENERATE";
export const SAVE_GENERATED = "Generator/SAVE_GENERATED";

export const SET_SELECTED_GENERATOR = "Generator/SET_SELECTED_GENERATOR";
export const SET_COMPONENT_METADATA = "Generator/SET_COMPONENT_METADATA";
export const SET_COMPONENT_NAME = "Generator/SET_COMPONENT_NAME";

export const stepToStage = (stage) => ({type: STEP_TO_STAGE, payload: stage});
export const setComponentMetadata = (metaData, metaHelp) => (dispatch, getState) => {
	dispatch({type: SET_COMPONENT_METADATA, payload: {metaData, metaHelp}});
};
export const setGeneratedData = (generatedData) => ({type: SET_GENERATED_DATA, payload: generatedData});

// Following methods go in wizard steps order

export const loadGenerators = (options) => (dispatch, getState) => {
	dispatch({type: LOAD_GENERATORS, payload: options});
	dispatch({type: STEP_TO_STAGE, payload: STAGE1});
};

export const startGeneratorWizard = (generatorName, generatorDirPath) => (dispatch, getState) => {
	dispatch({type: SET_SELECTED_GENERATOR, payload: {generatorName, generatorDirPath}});
	dispatch({type: STEP_TO_STAGE, payload: STAGE2});
};

export const pregenerate = (generatorName,
							generatorDirPath,
							namespace,
							componentName,
							modelNode) => (dispatch, getState) => {
	let canProceed = true;

	let firstChar = componentName.charAt(0).toUpperCase();
	componentName = firstChar + componentName.substr(1);

	if (namespace && namespace.length > 0 && !validator.isAlphanumeric(namespace)) {
		dispatch(failed('Please enter alphanumeric value for namespace'));
		canProceed = false;
	}
	if (!componentName || componentName.length <= 0 || !validator.isAlphanumeric(componentName)) {
		dispatch(failed('Please enter alphanumeric value for component name'));
		canProceed = false;
	}
	if (componentName === 'Component') {
		dispatch(failed('Component name can not be "Component"'));
		canProceed = false;
	}
	if (canProceed) {
		const {libraryPanel} = getState();
		const {componentTree} = libraryPanel;

		// console.log('Component tree: ', JSON.stringify(componentTree, null, 4));
		if (componentTree) {
			if (namespace && namespace.length > 0) {
				if (componentTree.modules) {
					const module = componentTree.modules[namespace];
					if (module && module.components) {
						const existingComponent = module.components[componentName];
						if (existingComponent) {
							canProceed = confirm(`There is a component with the equal name in ${namespace}.\n\n ` +
								`All reference to the component will be rewritten along with the source code files.\n`);
						}
					}
				}
			} else if (componentTree.components) {
				const existingComponent = componentTree.components[componentName];
				if (existingComponent) {
					canProceed = confirm(`There is a component with the equal name.\n\n ` +
						`All reference to the component will be rewritten along with the source code files.\n`);
				}
			}
		}
		if (canProceed) {
			dispatch({type: SET_COMPONENT_NAME, payload: {componentName, namespace}});
			dispatch(
				{
					type: PREGENERATE,
					payload: {generatorName, generatorDirPath, namespace, componentName, modelNode}
				}
			);
		}
	}

};

export const generate = (generatorName,
						 generatorDirPath,
						 namespace,
						 componentName,
						 modelNode,
						 metaData) => (dispatch, getState) => {
	dispatch(setComponentMetadata(metaData));
	dispatch(
		{
			type: GENERATE,
			payload: {generatorName, generatorDirPath, namespace, componentName, modelNode, metaData}
		}
	);
};

export const saveGenerated = (selectedKeys, files, dependencies, defaults) => (dispatch, getState) => {
	const newModelNode = defaults && defaults.length > 0 ? defaults[0] : [];
	dispatch({
		type: SAVE_GENERATED,
		payload: {selectedKey: selectedKeys[0], newModelNode, files, dependencies}
	});
};

export const hide = () => (dispatch, getState) => {
	dispatch(hideGenerator());
	dispatch(stepToStage(STAGE1));
};

export const containerActions = (dispatch) => bindActionCreators({
	hide, stepToStage
}, dispatch);
