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

import path from 'path';
import { includes, isEmpty, forOwn } from 'lodash';
import { config, storage, commons, gengine } from 'structor-commons';
import * as gengineManager from '../commons/gengine.js';
import * as sandboxCompilerManager from './sandboxCompilerManager.js';

// namespacesMeta = {
// 	namespaces: {
// 		[namespaceName]: {
// 			reducerPropName: ''
// 		}
// 	},
// 	dependencies: {
// 		packages: [
// 			{
// 				name: '',
// 				version: ''
// 			}
// 		]
// 	}
//
// };

export function getNamespacesInPages (componentTree, projectModel, pages) {
  let resultNamespaces = [];
  if (pages && pages.length > 0 && projectModel && projectModel.pages) {
    let modelComponentList = [];
    projectModel.pages.forEach(pageModel => {
      if (includes(pages, pageModel.pagePath)) {
        modelComponentList = modelComponentList.concat(gengine.getModelComponentList(componentTree, pageModel));
      }
    });
    if (modelComponentList && modelComponentList.length > 0) {
      // find all components out of any namespace
      const filtered = modelComponentList.filter(item => {
        return !item.namespace;
      });
      if (filtered && filtered.length > 0) {
        throw Error('Selected pages are including components out of any namespace.');
      }
      modelComponentList.forEach(item => {
        if (!includes(resultNamespaces, item.namespace)) {
          resultNamespaces.push(item.namespace);
        }
      });
    }
  }
  return resultNamespaces;
}

export function getDependentNamespaces (componentTree,
                                        checkingNamespaces,
                                        resultNamespaces = [],
                                        resultModules = []) {
  let newNamespaces = [];
  resultNamespaces = resultNamespaces.concat(checkingNamespaces);
  let combinedModel = gengine.combineAllModulesComponents(componentTree, checkingNamespaces);
  const modelComponentList = gengine.getModelComponentList(componentTree, combinedModel);
  if (modelComponentList && modelComponentList.length > 0) {
    // find all components out of any namespace
    const filtered = modelComponentList.filter(item => {
      return !item.namespace;
    });
    if (filtered && filtered.length > 0) {
      throw Error('Component models are including components out of any namespace.');
    }
    modelComponentList.forEach(item => {
      if (!includes(resultNamespaces, item.namespace)
        && !includes(newNamespaces, item.namespace)) {
        newNamespaces.push(item.namespace);
      }
    });
  }
  return gengine.getModulesImports(componentTree, checkingNamespaces)
    .then(imports => {
      // console.log('Imports :', JSON.stringify(imports, null, 4));
      if (imports && imports.length > 0) {
        imports.forEach(importItem => {
          if (importItem && !isEmpty(importItem)) {
            forOwn(importItem, (value, prop) => {
              const {source} = value;
              if (source && source.length > 0) {
                let importPath = source.replace(/\\/g, '/');
                if (source.indexOf('.') !== 0) {
                  let importPathParts = importPath.split('/');
                  if (importPathParts && importPathParts.length > 0) {
                    if (importPathParts[0] === 'modules') {
                      if (!includes(resultNamespaces, importPathParts[1])
                        && !includes(newNamespaces, importPathParts[1])) {
                        newNamespaces.push(importPathParts[1]);
                      }
                    } else {
                      if (!includes(resultModules, importPathParts[0])) {
                        resultModules.push(importPathParts[0]);
                      }
                    }
                  }
                }
              }
            });
          }
        });
      }
      if (newNamespaces.length > 0) {
        return getDependentNamespaces(componentTree, newNamespaces, resultNamespaces, resultModules);
      }
      return {depNamespaces: resultNamespaces, modules: resultModules};
    });
}

export function getAllDependencies (namespaces, pages) {
  let result = {
    dependencies: {
      packages: [],
    },
  };
  let componentTree;
  return storage.getComponentTree()
    .then(tree => {
      componentTree = tree;
      return storage.readProjectJsonModel();
    })
    .then(projectModel => {
      return getNamespacesInPages(componentTree, projectModel, pages);
    })
    .then(pagesNamespaces => {
      return getDependentNamespaces(componentTree, [].concat(namespaces, pagesNamespaces));
    })
    .then(deps => {
      const {depNamespaces, modules} = deps;
      result.namespaces = depNamespaces;
      let tasks = [];
      if (modules && modules.length > 0) {
        modules.forEach(dep => {
          tasks.push(
            commons.getPackageVersion(dep, config.getProjectDir())
              .then(version => {
                if (version) {
                  result.dependencies.packages.push({
                    name: dep,
                    version: version,
                  });
                }
              })
              .catch(error => {
                console.error(error);
              })
          );
        });
      }
      return Promise.all(tasks).then(() => {
        return result;
      });
    });
}

export function extractNamespaces (namespaces, dependencies, pages, dirPath) {
  const sandboxGeneratorPath = config.sandboxGeneratorDirPath();
  const sandboxModulesDirPath = path.join(config.sandboxDirPath(), 'modules');

  const extractDirPath = dirPath;
  const extractSrcDirPath = path.join(extractDirPath, 'modules');
  const extractDefaultsDirPath = path.join(extractDirPath, 'defaults');
  const extractDocsDirPath = path.join(extractDirPath, 'docs');
  const extractStructorDirPath = path.join(extractDirPath, '.structor');

  let generatorData = {
    namespaces,
    project: config.getProjectConfig(),
  };
  let namespaceModule = undefined;
  let structorNamespaces = {
    namespaces: {},
    dependencies
  };
  let componentTree;
  return storage.getComponentTree()
    .then(tree => {
      generatorData.index = tree;
      componentTree = tree;
      return gengineManager.process(sandboxGeneratorPath, generatorData);
    })
    .then(generatedObject => {
      const {files} = generatedObject;
      return storage.saveGenerated({}, files);
    })
    .then(() => {
      let copySequence = Promise.resolve();
      namespaces.forEach(namespace => {
        copySequence = copySequence.then(() => {
          namespaceModule = componentTree.modules[namespace];
          if (namespaceModule && namespaceModule.absolutePath) {
            const namespaceModuleAbsolutePath = namespaceModule.absolutePath;
            return commons.copyFile(
              namespaceModuleAbsolutePath,
              path.join(sandboxModulesDirPath, namespace)
            );
          }
        });
      });
      return copySequence;
    })
    .then(() => {
      return sandboxCompilerManager.compileSandbox()
        .catch(error => {
          throw Error(
            `It seems that some components include external components out of any namespace.\n\n\n ${error}`
          );
        });
    })
    .then(() => {
      let rewriteSequence = Promise.resolve();
      const globalReducerSource = componentTree.reducersSourceCode;
      namespaces.forEach(namespace => {
        rewriteSequence = rewriteSequence.then(() => {
          namespaceModule = componentTree.modules[namespace];
          if (namespaceModule && namespaceModule.absolutePath) {
            const reducerFilePath = namespaceModule.reducerFilePath;
            if (reducerFilePath) {
              const reducerPropertyName =
                gengine.getReducerPropertyName(globalReducerSource, namespaceModule.reducerImportPath);
              structorNamespaces.namespaces[namespace] = structorNamespaces.namespaces[namespace] || {};
              structorNamespaces.namespaces[namespace].reducerPropName = reducerPropertyName;
            }
            return commons.copyFile(namespaceModule.absolutePath, path.join(extractSrcDirPath, namespace))
              .then(() => {
                const docsDirPath = path.join(config.docsComponentsDirPath(), namespace);
                return commons.copyFile(docsDirPath, path.join(extractDocsDirPath, namespace))
                  .catch(err => {
                    console.error('Copying docs. ', err);
                  });
              })
              .then(() => {
                const defaultsDirPath = path.join(config.componentDefaultsDirPath(), namespace);
                return commons.copyFile(defaultsDirPath, path.join(extractDefaultsDirPath, namespace))
                  .catch(err => {
                    console.error('Copying defaults. ', err);
                  });
              });
          }
        });
      });
      return rewriteSequence;
    })
    .then(() => {
      if (pages && pages.length > 0) {
        return storage.readProjectJsonModel().then(model => {
          let extractedModel = {pages: []};
          if (model && model.pages) {
            model.pages.forEach(page => {
              if (includes(pages, page.pagePath)) {
                extractedModel.pages.push(page);
              }
            });
          }
          return commons.writeJson(path.join(extractStructorDirPath, 'model.json'), extractedModel);
        });
      }
    })
    .then(() => {
      return commons.writeJson(path.join(extractDirPath, 'structor-namespaces.json'), structorNamespaces);
    })
    .then(() => {
      return commons.removeFile(config.sandboxDirPath());
    });
}