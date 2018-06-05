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

import { cloneDeep } from 'lodash';

export function findComponentDef (componentTree, componentName, namespace, defaultsIndex = 0) {
  let componentDef = undefined;
  if (componentName && namespace) {
    if (componentTree.modules) {
      let module = componentTree.modules[namespace];
      if (module && module.components) {
        componentDef = module.components[componentName];
      } else {
        throw Error(`Namespace module ${namespace} was not found.`);
      }
    }
  } else if (componentName) {
    if (componentTree.htmlComponents) {
      componentDef = componentTree.htmlComponents[componentName];
    }
    if (!componentDef && componentTree.components) {
      componentDef = componentTree.components[componentName];
    }
  }
  if (componentDef) {
    const {defaults} = componentDef;
    if (defaults && defaults.length > defaultsIndex) {
      return componentDef;
    } else {
      throw Error(`Model definition for ${componentName} component is missing.`);
    }
  } else {
    if (namespace) {
      throw Error(`Component ${componentName} in namespace ${namespace} was not found.`);
    } else {
      throw Error(`Component ${componentName} was not found.`);
    }
  }
}

export function getComponentTupleModel (componentTree, componentNames) {
  let tupleModel = undefined;
  if (componentNames && componentNames.length > 0) {
    let componentName;
    let namespace;
    let firstBracePos;
    let secondBracePos;
    let componentDef;
    componentNames.forEach(name => {
      firstBracePos = name.indexOf('[');
      secondBracePos = name.indexOf(']');
      if (firstBracePos > 0 && secondBracePos > 0) {
        componentName = name.substr(0, firstBracePos).trim();
        namespace = name.substr(firstBracePos + 1, secondBracePos - firstBracePos - 1);
      } else {
        componentName = name.trim();
        namespace = undefined;
      }
      try {
        componentDef = findComponentDef(componentTree, componentName, namespace);
        const {defaults} = componentDef;
        if (tupleModel) {
          tupleModel.children = [cloneDeep(defaults[0])];
        } else {
          tupleModel = cloneDeep(defaults[0]);
        }
      } catch (e) {
        // do nothing;
        console.error('Error in searching the component: ', e);
      }
    });
  }
  return tupleModel;
}

export function getTemplatePageModel () {
  return {
    pageName: 'UnnamedPage',
    pagePath: '/UnnamedPage',
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1em',
          }
        },
        children: [
          {
            type: 'div',
            children: [
              {
                type: 'h3',
                props: {
                  style: {
                    padding: '1em',
                    textAlign: 'center'
                  }
                },
                children: [
                  {
                    type: 'span',
                    text: 'Click on me and start creating a new cool component.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}