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

import { createStructuredSelector, createSelector } from 'reselect';
import { graphApi } from 'api';

export const selectedKeysSelector = state => state.selectionBreadcrumbs.selectedKeys;

export const selectedComponentModelSelector = createSelector(
  selectedKeysSelector,
  (keys) => {
    let result = undefined;
    if (keys && keys.length === 1) {
      const selectedNode = graphApi.getNode(keys[0]);
      if (selectedNode) {
        const {modelNode} = selectedNode;
        result = modelNode;
      }
    }
    return result;
  }
);

export const modelSelector = createStructuredSelector({
  componentModel: state => state.selectionBreadcrumbs
});

