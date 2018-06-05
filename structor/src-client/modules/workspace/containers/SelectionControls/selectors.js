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

import { createSelector, createStructuredSelector } from 'reselect';
import { graphApi, utilsStore } from 'api';
import { selectedKeysSelector } from 'modules/workspace/containers/SelectionBreadcrumbs/selectors';
import { componentTreeSelector } from 'modules/workspace/containers/LibraryPanel/selectors';

export const selectedComponentsSelector = createSelector(
  componentTreeSelector,
  selectedKeysSelector,
  (tree, keys) => {
    let result = [];
    if(keys && keys.length > 0){
      let selectedNode;
      let componentDef;
      let selectedComponent;
      keys.forEach(key => {
        selectedNode = graphApi.getNode(key);
        if (selectedNode) {
          const {modelNode} = selectedNode;
          try {
            componentDef = utilsStore.findComponentDef(tree, modelNode.type, modelNode.namespace);
            selectedComponent = {
              key,
              componentName: modelNode.type,
              namespace: modelNode.namespace,
              props: modelNode.props,
              text: modelNode.text,
              children: modelNode.children,
              sourceFilePath: componentDef.absoluteIndexFilePath,
              defaults: componentDef.defaults,
            };
            result.push(selectedComponent);
          } catch (e) {
            // do nothing;
          }
        }
      });
    }
    return result;
  }
);

export const modelSelector = createStructuredSelector({
  componentModel: state => state.selectionControls,
  selectedKeys: selectedKeysSelector,
});

