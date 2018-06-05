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

import { createStructuredSelector } from 'reselect';
import { userAccountSelector } from 'modules/app/containers/AppContainer/selectors';

export const generatorNameSelector = state => state.generator.generatorName;
export const generatorDirPathSelector = state => state.generator.generatorDirPath;
export const componentNameSelector = state => state.generator.componentName;
export const namespaceSelector = state => state.generator.namespace;
export const metaDataSelector =  state => state.generator.metaData;
export const metaHelpSelector =  state => state.generator.metaHelp;
export const generatedDataSelector = state => state.generator.generatedData;

export const modelSelector = createStructuredSelector({
    componentModel: state => state.generator
});
