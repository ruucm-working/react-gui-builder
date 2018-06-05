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

export const selectedNamespacesSelector = state => state.extractor.selectedNamespaces;
export const selectedPagesSelector = state => state.extractor.selectedPages;
export const dependentNamespacesSelector = state => state.extractor.dependentNamespaces;
export const dependenciesSelector = state => state.extractor.dependencies;
export const recentDirPathsSelector = state => state.extractor.recentDirPaths;

export const modelSelector = createStructuredSelector({
    stage: state => state.extractor.stage
});
