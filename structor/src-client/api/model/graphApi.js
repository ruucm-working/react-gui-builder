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

import {forOwn, isObject, takeRight, last, initial} from 'lodash';
import {Graph} from 'graphlib';
import {fulex} from '../utils/utils.js';
import {getAvailableRoute} from './reactRouterApi.js';
import {mapModel, mapModelForNode, makeNodeWrapper, traverseGraphBranch, adjustIndices} from './graphUtils.js';
import {detachGraphNode, detachGraphNodes, copyGraphNode, copyGraphNodes} from './graphUtils.js';

let bufferKey = undefined;

let graphObject = {
	graph: undefined,
	model: undefined,
	pageNodes: []
};

let history = [];

export function pushHistory(pagePath) {
	if (history.length >= 50) {
		history = takeRight(history, 50);
	}
	history.push({
		model: fulex(graphObject.model),
		markedKeys: getAllMarkedKeys(),
		pagePath: pagePath
	});
}

export function popHistory() {
	if (history.length > 0) {
		const historyObject = last(history);
		initGraph(historyObject.model);
		history = initial(history);
		return historyObject;
	}
	return undefined;
}

export function getHistorySize() {
	return history.length;
}

export function initGraph(initialModel) {
	if (graphObject.graph) {
		delete graphObject.graph;
	}
	if (graphObject.model) {
		delete graphObject.model;
	}
	if (graphObject.pageNodes) {
		delete graphObject.pageNodes;
	}
	graphObject.model = fulex(initialModel);
	if (graphObject.model && graphObject.model.pages && graphObject.model.pages.length > 0) {
		graphObject.graph = new Graph({compound: true});
		graphObject.graph.setDefaultEdgeLabel('link');
		graphObject.pageNodes = [];
		let pageKey;
		graphObject.model.pages.forEach((page, index) => {
			pageKey = mapModel(graphObject.graph, page, index);
			graphObject.pageNodes.push({
				pagePath: page.pagePath,
				pageName: page.pageName,
				pageKey: pageKey
			});
		});
	}
}

export function getGraph() {
	return graphObject.graph;
}

export function getModel() {
	return graphObject.model;
}

export function getPages() {
	return graphObject.pageNodes;
}

export function getNode(key) {
	return graphObject.graph.node(key);
}

export function getPagePath(pathname) {
	let paths = [];
	graphObject.pageNodes.forEach(pageNode => {
		paths.push(pageNode.pagePath);
	});
	return getAvailableRoute(paths, pathname);
}

export function getPageModelByPagePath(pathname) {
	let found = undefined;
	if (graphObject.model && graphObject.model.pages) {
		found = graphObject.model.pages.find(page => page.pagePath === pathname);
	}
	return found;
}

export function getWrappedModelByPagePath(pathname) {
	let wrappedModel = undefined;
	let paths = [];
	graphObject.pageNodes.forEach(pageNode => {
		paths.push(pageNode.pagePath);
	});
	const path = getAvailableRoute(paths, pathname);
	const pageNode = graphObject.pageNodes.find(pageNode => {
		return pageNode.pagePath === path;
	});
	if (pageNode) {
		wrappedModel = traverseGraph(pageNode.pageKey);
	}
	return wrappedModel;
}

export function getMarkedKeysByPagePath(pathname) {
	let paths = [];
	graphObject.pageNodes.forEach(pageNode => {
		paths.push(pageNode.pagePath);
	});
	const path = getAvailableRoute(paths, pathname);
	const pageNode = graphObject.pageNodes.find(pageNode => {
		return pageNode.pagePath === path;
	});
	return getMarkedKeys(pageNode ? pageNode.pageKey : undefined);
}

export function getChildNodes(key) {
	let result = [];
	const children = graphObject.graph.children(key);
	if (children && children.length > 0) {
		children.forEach(child => {
			result.push(makeNodeWrapper(child, graphObject.graph.node(child)));
		});
		result.sort((a, b) => a.index - b.index);
	}
	return result;
}

export function hasNode(key) {
	return graphObject.graph.hasNode(key);
}

function traverseGraph(rootNodeKey, result) {
	const {graph} = graphObject;
	let rootNode = graph.node(rootNodeKey);
	if (rootNode) {
		let resultNode = makeNodeWrapper(rootNodeKey, rootNode);
		const parentKey = graph.parent(rootNodeKey);
		if (!parentKey) {
			resultNode.isRoot = true;
		}
		let children = graph.children(rootNodeKey);
		if (children && children.length > 0) {
			children.forEach(child => {
				traverseGraph(child, resultNode);
			});
			if (resultNode.children && resultNode.children.length > 0) {
				resultNode.children.sort((a, b) => a.index - b.index);
			}
		}
		if (!result) {
			result = resultNode;
		} else if (rootNode.prop) {
			result.props = result.props || {};
			result.props[rootNode.prop] = resultNode;
		} else {
			result.children = result.children || [];
			result.children.push(resultNode);
		}
	}
	return result;
}

export function traverseAllGraph() {
	const {pageNodes} = graphObject;
	let result = [];
	pageNodes.forEach(pNode => {
		result = result.concat(traverseGraph(pNode.pageKey));
	});
	return result;
}

export function getParentsList(childNodeKey, result) {
	const {graph} = graphObject;
	let childNode = graph.node(childNodeKey);
	if (childNode) {
		let childModelNode = makeNodeWrapper(childNodeKey, childNode);
		result = result || [];
		result.push(childModelNode);
		const parentNodeKey = graph.parent(childNodeKey);
		if (parentNodeKey) {
			getParentsList(parentNodeKey, result);
		} else {
			childModelNode.isRoot = true;
		}
	}
	return result;
}

export function changePagePathAndName(pagePath, nextPagePath, nextPageName) {
	const {graph, pageNodes} = graphObject;
	const pageNode = pageNodes.find(pNode => {
		return pNode.pagePath === pagePath;
	});
	if (!pageNode) {
		throw Error('Change page path and name: specified path ' + pagePath + ' was not found.');
	}
	let rootNode = graph.node(pageNode.pageKey);
	if (rootNode) {
		let modelNode = rootNode.modelNode;
		modelNode.pageName = nextPageName;
		modelNode.pagePath = nextPagePath;
		pageNode.pageName = nextPageName;
		pageNode.pagePath = nextPagePath;
	}
	return graphObject.pageNodes;
}

export function addNewPage(initialModel, pagePath, pageName) {
	let {graph, model, pageNodes} = graphObject;
	let pageModel = fulex(initialModel);
	pageModel.pagePath = pagePath;
	pageModel.pageName = pageName;
	model.pages.push(pageModel);
	const pageKey = mapModel(graph, pageModel, pageNodes.length, true);
	pageNodes.push({
		pagePath: pagePath,
		pageName: pageName,
		pageKey: pageKey
	});
	return pageNodes;
}

export function duplicatePage(pagePath, nextPagePath, nextPageName) {
	let {graph, model, pageNodes} = graphObject;
	const pageNode = pageNodes.find(pNode => {
		return pNode.pagePath === pagePath;
	});
	if (!pageNode) {
		throw Error('Duplicate page: specified path ' + pagePath + ' was not found.');
	}
	let rootNode = graph.node(pageNode.pageKey);
	if (rootNode) {
		let pageModel = fulex(rootNode.modelNode);
		pageModel.pagePath = nextPagePath;
		pageModel.pageName = nextPageName;
		model.pages.push(pageModel);
		const pageKey = mapModel(graph, pageModel, pageNodes.length, true);
		pageNodes.push({
			pagePath: pageModel.pagePath,
			pageName: pageModel.pageName,
			pageKey: pageKey
		});
	}
	return pageNodes;
}

export function setIndexPage(pagePath) {
	let {graph, model, pageNodes} = graphObject;

	const pageNode = pageNodes.find(pNode => {
		return pNode.pagePath === pagePath;
	});
	if (!pageNode) {
		throw Error('Set index page: specified path ' + pagePath + ' was not found.');
	}

	let rootNode = graph.node(pageNode.pageKey);
	if (rootNode) {
		const tempModel = model.pages.splice(rootNode.index, 1)[0];
		if (tempModel) {
			model.pages.splice(0, 0, tempModel);
		} else {
			console.error('Page model was not found in pages model index: ' + rootNode.index);
		}
		let newPageNodes = [];
		let newPageNode;
		let graphNode;
		model.pages.forEach((page, index) => {
			newPageNode = pageNodes.find(pNode => {
				return pNode.pagePath === page.pagePath;
			});
			if (newPageNode) {
				graphNode = graph.node(newPageNode.pageKey);
				graphNode.index = index;
				newPageNodes.push(newPageNode);
			}
		});
		graphObject.pageNodes = newPageNodes;
	}
	return graphObject.pageNodes;
}

export function deletePage(pagePath) {
	let {graph, model, pageNodes} = graphObject;

	if (model.pages && model.pages.length === 1) {
		throw Error('The current page is the only page in the project and can not be deleted.');
	}

	const pageNode = pageNodes.find(pNode => {
		return pNode.pagePath === pagePath;
	});
	if (!pageNode) {
		throw Error('Delete page: specified path ' + pagePath + ' was not found.');
	}

	let rootNode = graph.node(pageNode.pageKey);
	if (rootNode) {
		model.pages.splice(rootNode.index, 1);
		traverseGraphBranch(graph, pageNode.pageKey, (nodeKey => {
			graph.removeNode(nodeKey);
		}));

		let newPageNodes = [];
		let newPageNode;
		let graphNode;
		model.pages.forEach((page, index) => {
			newPageNode = pageNodes.find(pNode => {
				return pNode.pagePath === page.pagePath;
			});
			if (newPageNode) {
				graphNode = graph.node(newPageNode.pageKey);
				graphNode.index = index;
				newPageNodes.push(newPageNode);
			}
		});
		graphObject.pageNodes = newPageNodes;
	}
	return graphObject.pageNodes;
}


function getDetachedKeysForCutting() {
	const {graph, pageNodes} = graphObject;
	const testFunc = node => node.isForCutting;
	let detachedKeys = [];
	pageNodes.forEach(pNode => {
		detachGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
	});
	return detachedKeys;
}

function getDetachedKeysForCopying() {
	const {graph, pageNodes} = graphObject;
	const testFunc = node => node.isForCopying;
	let detachedKeys = [];
	pageNodes.forEach(pNode => {
		copyGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
	});
	return detachedKeys;
}

export function isCutPasteAvailable(nodeKey) {
	let childNode = graphObject.graph.node(nodeKey);
	return !!(childNode && !childNode.isForCuttingChild && !childNode.isForCutting);
}

export function cutPasteBeforeOrAfter(isAfter) {
	const {selected} = getAllMarkedKeys();
	let resultKeys = [];
	if (selected && selected.length === 1 && isCutPasteAvailable(selected[0])) {
		const {graph} = graphObject;
		const nodeKey = selected[0];
		const node = graph.node(nodeKey);
		if (!node) {
			console.error('Cut & paste before or after node: node with key ' + nodeKey + ' was not found.');
		} else if (!node.prop) {
			let detachedKeys = getDetachedKeysForCutting();
			if (detachedKeys.length > 0) {
				const parentKey = graph.parent(nodeKey);
				if (parentKey) {
					let detachedModelNodes = [];
					let detachedNode;
					detachedKeys.forEach(detachedKey => {
						detachedNode = graph.node(detachedKey);
						if (detachedNode && detachedNode.modelNode) {
							graph.setParent(detachedKey, parentKey);
							detachedModelNodes.push(detachedNode.modelNode);
						}
					});
					let parentNode = graph.node(parentKey);
					let {modelNode} = parentNode;
					let modelNodesArgs = [node.index + (isAfter ? 1 : 0), 0].concat(detachedModelNodes);
					modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
					adjustIndices(graph, parentKey);
				}
			}
			resultKeys = resultKeys.concat(detachedKeys);
		} else {
			resultKeys.push(nodeKey);
		}
	} else {
		console.error('Cut & paste before or after node: pasting can not be provided for the same component or its children, or a multiple selection');
	}
	return resultKeys;
}

export function cutPasteFirstOrLast(isFirst) {
	const {selected} = getAllMarkedKeys();
	let resultKeys = [];
	if (selected && selected.length === 1 && isCutPasteAvailable(selected[0])) {
		const {graph} = graphObject;
		const nodeKey = selected[0];
		const node = graph.node(nodeKey);
		if (!node) {
			console.error('Cut & paste first or last node: node with key ' + nodeKey + ' was not found.');
		} else {
			let detachedKeys = getDetachedKeysForCutting();
			if (detachedKeys.length > 0) {
				let detachedModelNodes = [];
				let detachedNode;
				detachedKeys.forEach(detachedKey => {
					detachedNode = graph.node(detachedKey);
					if (detachedNode && detachedNode.modelNode) {
						graph.setParent(detachedKey, nodeKey);
						detachedModelNodes.push(detachedNode.modelNode);
					}
				});
				let {modelNode} = node;
				modelNode.children = modelNode.children || [];
				const lastIndex = modelNode.children.length > 0 ? modelNode.children.length : 0;
				let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(detachedModelNodes);
				modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
				adjustIndices(graph, nodeKey);
			}
			resultKeys = resultKeys.concat(detachedKeys);
		}
	} else {
		console.error('Cut & paste first or last node: pasting can not be provided for the same component or its children, or a multiple selection');
	}
	return resultKeys;
}

export function cutPasteReplace() {
	const {selected} = getAllMarkedKeys();
	let resultKeys = [];
	if (selected && selected.length === 1 && isCutPasteAvailable(selected[0])) {
		const {graph} = graphObject;
		const nodeKey = selected[0];
		const node = graph.node(nodeKey);
		if (!node) {
			console.error('Cut & paste replace: node with key ' + nodeKey + ' was not found.');
		} else if (!node.prop) {
			let detachedKeys = getDetachedKeysForCutting();
			if (detachedKeys.length > 0) {
				const parentKey = graph.parent(nodeKey);
				if (parentKey) {
					const nodeIndex = node.index;
					traverseGraphBranch(graph, nodeKey, (key => {
						graph.removeNode(key);
					}));
					delete node.modelNode;
					let detachedModelNodes = [];
					let detachedNode;
					detachedKeys.forEach(detachedKey => {
						detachedNode = graph.node(detachedKey);
						if (detachedNode && detachedNode.modelNode) {
							graph.setParent(detachedKey, parentKey);
							detachedModelNodes.push(detachedNode.modelNode);
						}
					});
					let parentNode = graph.node(parentKey);
					let {modelNode} = parentNode;
					modelNode.children = modelNode.children || [];
					let modelNodesArgs = [nodeIndex, 1].concat(detachedModelNodes);
					modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
					adjustIndices(graph, parentKey);
				}
			}
			resultKeys = resultKeys.concat(detachedKeys);
		} else {
			resultKeys.push(nodeKey);
		}
	} else {
		console.error('Cut & paste replace: replacing can not be provided for the same component or a multiple selection');
	}
	return resultKeys;
}

//export function cutPasteWrap(nodeKey){
//    if(!isCutPasteAvailable(nodeKey)){
//        throw Error('Node with key ' + nodeKey + ' is not available to cut & paste operation.');
//    }
//    const {graph} = graphObject;
//    const node = graph.node(nodeKey);
//    if(!node){
//        throw Error('Cut & paste wrap: node with key ' + nodeKey + ' was not found.');
//    }
//    if(!node.prop){
//        const { forCutting } = getAllMarkedKeys();
//        if(forCutting.length !== 1){
//            throw Error('Cut & paste wrap: wrapping can be applied only for single component');
//        }
//        const pastedKeys = cutPasteBeforeOrAfter(nodeKey, false);
//        removeForCutting(pastedKeys[0]);
//        setForCutting(nodeKey);
//        cutPasteFirstOrLast(pastedKeys[0], false);
//        removeForCutting(nodeKey);
//        return pastedKeys;
//    } else {
//        return [nodeKey];
//    }
//}

export function copyPasteBeforeOrAfter(isAfter) {
	const {selected} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			const node = graph.node(nodeKey);
			if (!node) {
				console.error('Copy & paste before or after node: node with key ' + nodeKey + ' was not found.');
			} else if (!node.prop) {
				let detachedKeys = getDetachedKeysForCopying();
				if (detachedKeys.length > 0) {
					const parentKey = graph.parent(nodeKey);
					if (parentKey) {
						let detachedModelNodes = [];
						let detachedNode;
						detachedKeys.forEach(detachedKey => {
							detachedNode = graph.node(detachedKey);
							if (detachedNode && detachedNode.modelNode) {
								graph.setParent(detachedKey, parentKey);
								detachedModelNodes.push(detachedNode.modelNode);
							}
						});
						let parentNode = graph.node(parentKey);
						let {modelNode} = parentNode;
						modelNode.children = modelNode.children || [];
						let modelNodesArgs = [node.index + (isAfter ? 1 : 0), 0].concat(detachedModelNodes);
						modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
						adjustIndices(graph, parentKey);
					}
				}
				resultKeys = resultKeys.concat(detachedKeys);
			} else {
				resultKeys.push(nodeKey);
			}
		});
	}
	return resultKeys;
}

export function copyPasteFirstOrLast(isFirst) {
	const {selected} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			const node = graph.node(nodeKey);
			if (!node) {
				console.error('Copy & paste first or last node: node with key ' + nodeKey + ' was not found.');
			} else {
				let detachedKeys = getDetachedKeysForCopying();
				if (detachedKeys.length > 0) {

					let detachedModelNodes = [];
					let detachedNode;
					detachedKeys.forEach(detachedKey => {
						detachedNode = graph.node(detachedKey);
						if (detachedNode && detachedNode.modelNode) {
							graph.setParent(detachedKey, nodeKey);
							detachedModelNodes.push(detachedNode.modelNode);
						}
					});
					let {modelNode} = node;
					modelNode.children = modelNode.children || [];
					const lastIndex = modelNode.children.length > 0 ? modelNode.children.length : 0;
					let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(detachedModelNodes);
					modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
					adjustIndices(graph, nodeKey);
				}
				resultKeys = resultKeys.concat(detachedKeys);
			}
		});
	}
	return resultKeys;
}

export function copyPasteReplace() {
	const {selected, forCopying} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			if (forCopying.indexOf(nodeKey) < 0) {
				const node = graph.node(nodeKey);
				if (!node) {
					throw Error('Copy & paste replace: node with key ' + nodeKey + ' was not found.');
				} else if (!node.prop) {
					let detachedKeys = getDetachedKeysForCopying();
					if (detachedKeys.length > 0) {
						const parentKey = graph.parent(nodeKey);
						if (parentKey) {
							const nodeIndex = node.index;
							traverseGraphBranch(graph, nodeKey, (key => {
								graph.removeNode(key);
								const removedIndex = resultKeys.indexOf(key);
								if (removedIndex >= 0) {
									resultKeys.splice(removedIndex, 1);
								}
							}));
							delete node.modelNode;
							let detachedModelNodes = [];
							let detachedNode;
							detachedKeys.forEach(detachedKey => {
								detachedNode = graph.node(detachedKey);
								if (detachedNode && detachedNode.modelNode) {
									graph.setParent(detachedKey, parentKey);
									detachedModelNodes.push(detachedNode.modelNode);
								}
							});
							let parentNode = graph.node(parentKey);
							let {modelNode} = parentNode;
							modelNode.children = modelNode.children || [];
							let modelNodesArgs = [nodeIndex, 1].concat(detachedModelNodes);
							modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
							adjustIndices(graph, parentKey);
						}
					}
					resultKeys = resultKeys.concat(detachedKeys);
				} else {
					resultKeys.push(nodeKey);
				}
			} else {
				console.warn('Copy & paste replace: replacing can not be provided for the same component.');
			}
		});
	}
	return resultKeys;
}
//
// export function copyPasteWrap (nodeKey) {
//   const {graph} = graphObject
//   const node = graph.node(nodeKey)
//   if (!node) {
//     throw Error('Copy & paste wrap: node with key ' + nodeKey + ' was not found.')
//   }
//   if (!node.prop) {
//     const {forCopying} = getAllMarkedKeys()
//     if (forCopying.length !== 1) {
//       throw Error('Copy & paste wrap: wrapping can be applied only for single component')
//     }
//     const pastedKeys = copyPasteBeforeOrAfter(nodeKey, false)
//     setForCutting(nodeKey)
//     cutPasteFirstOrLast(pastedKeys[0], false)
//     removeForCutting(nodeKey)
//     return pastedKeys
//   } else {
//     return [nodeKey]
//   }
// }

export function setBuffer(model) {
	const {graph} = graphObject;
	if (bufferKey) {
		removeBuffer();
	}
	const newModel = fulex(model);
	bufferKey = mapModel(graph, newModel, 0);
	return bufferKey;
}

export function removeBuffer() {
	const {graph} = graphObject;
	let childNode;
	if (bufferKey) {
		traverseGraphBranch(graph, bufferKey, childKey => {
			childNode = graph.node(childKey);
			if (childNode) {
				delete childNode.modelNode;
				graph.removeNode(childKey);
			}
		});
		bufferKey = undefined;
	}
}

export function fromBufferBeforeOrAfter(isAfter, quickKey) {
	const {selected} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			const node = graph.node(nodeKey);
			if (!node) {
				console.error('From buffer to before or after node: node with key ' + nodeKey + ' was not found.');
			} else if (!node.prop) {
				let detachedKey = copyGraphNode(graph, quickKey ? quickKey : bufferKey);
				if (detachedKey) {
					const parentKey = graph.parent(nodeKey);
					if (parentKey) {
						let detachedModelNodes = [];
						let detachedNode = graph.node(detachedKey);
						if (detachedNode && detachedNode.modelNode) {
							graph.setParent(detachedKey, parentKey);
							detachedModelNodes.push(detachedNode.modelNode);
						}
						let parentNode = graph.node(parentKey);
						let {modelNode} = parentNode;
						modelNode.children = modelNode.children || [];
						let modelNodesArgs = [node.index + (isAfter ? 1 : 0), 0].concat(detachedModelNodes);
						modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
						adjustIndices(graph, parentKey);
					}
				}
				resultKeys.push(detachedKey);
			} else {
				resultKeys.push(nodeKey);
			}
		});
	}
	return resultKeys;
}

export function quickBeforeOrAfter(model, isAfter) {
	const {graph} = graphObject;
	let newModel = fulex(model);
	let quickKey = mapModel(graph, newModel, 0);
	const resultKeys = fromBufferBeforeOrAfter(isAfter, quickKey);
	let childNode;
	traverseGraphBranch(graph, quickKey, childKey => {
		childNode = graph.node(childKey);
		if (childNode) {
			delete childNode.modelNode;
			graph.removeNode(childKey);
		}
	});
	newModel = undefined;
	quickKey = undefined;
	return resultKeys;
}

export function fromBufferFirstOrLast(isFirst, quickKey) {
	const {selected} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			const node = graph.node(nodeKey);
			if (!node) {
				console.error('From buffer to first or last node: node with key ' + nodeKey + ' was not found.');
			} else {
				let detachedKey = copyGraphNode(graph, quickKey ? quickKey : bufferKey);
				if (detachedKey) {

					let detachedModelNodes = [];
					let detachedNode = graph.node(detachedKey);
					if (detachedNode && detachedNode.modelNode) {
						graph.setParent(detachedKey, nodeKey);
						detachedModelNodes.push(detachedNode.modelNode);
					}
					let {modelNode} = node;
					modelNode.children = modelNode.children || [];
					const lastIndex = modelNode.children.length > 0 ? modelNode.children.length : 0;
					let modelNodesArgs = [(isFirst ? 0 : lastIndex), 0].concat(detachedModelNodes);
					modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
					adjustIndices(graph, nodeKey);
				}
				resultKeys.push(detachedKey);
			}
		});
	}
	return resultKeys;
}

export function quickFirstOrLast(model, isFirst) {
	const {graph} = graphObject;
	let newModel = fulex(model);
	let quickKey = mapModel(graph, newModel, 0);
	const resultKeys = fromBufferFirstOrLast(isFirst, quickKey);
	let childNode;
	traverseGraphBranch(graph, quickKey, childKey => {
		childNode = graph.node(childKey);
		if (childNode) {
			delete childNode.modelNode;
			graph.removeNode(childKey);
		}
	});
	newModel = undefined;
	quickKey = undefined;
	return resultKeys;
}

export function fromBufferReplace(quickKey) {
	const {selected} = getAllMarkedKeys();
	const {graph} = graphObject;
	let resultKeys = [];
	if (selected && selected.length > 0) {
		selected.forEach(nodeKey => {
			const node = graph.node(nodeKey);
			if (!node) {
				console.error('From buffer replace: node with key ' + nodeKey + ' was not found.');
			} else if (!node.prop) {
				let detachedKey = copyGraphNode(graph, quickKey ? quickKey : bufferKey);
				if (detachedKey) {
					const parentKey = graph.parent(nodeKey);
					if (parentKey) {
						const nodeIndex = node.index;
						traverseGraphBranch(graph, nodeKey, (key => {
							graph.removeNode(key);
						}));
						delete node.modelNode;
						let detachedModelNodes = [];
						let detachedNode = graph.node(detachedKey);
						if (detachedNode && detachedNode.modelNode) {
							graph.setParent(detachedKey, parentKey);
							detachedModelNodes.push(detachedNode.modelNode);
						}
						let parentNode = graph.node(parentKey);
						let {modelNode} = parentNode;
						modelNode.children = modelNode.children || [];
						let modelNodesArgs = [nodeIndex, 1].concat(detachedModelNodes);
						modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
						adjustIndices(graph, parentKey);
					}
				}
				resultKeys.push(detachedKey);
			} else {
				resultKeys.push(nodeKey);
			}
		});
	}
	return resultKeys;
}

export function quickReplace(model) {
	const {graph} = graphObject;
	let newModel = fulex(model);
	let quickKey = mapModel(graph, newModel, 0);
	const resultKeys = fromBufferReplace(quickKey);
	let childNode;
	traverseGraphBranch(graph, quickKey, childKey => {
		childNode = graph.node(childKey);
		if (childNode) {
			delete childNode.modelNode;
			graph.removeNode(childKey);
		}
	});
	newModel = undefined;
	quickKey = undefined;
	return resultKeys;
}

//export function fromBufferWrap(nodeKey, quickKey){
//    const {graph} = graphObject;
//    const node = graph.node(nodeKey);
//    if(!node){
//        throw Error('From buffer wrap: node with key ' + nodeKey + ' was not found.');
//    }
//    if(!node.prop){
//        const pastedKeys = fromBufferBeforeOrAfter(nodeKey, false, quickKey);
//        setForCutting(nodeKey);
//        cutPasteFirstOrLast(pastedKeys[0], false);
//        removeForCutting(nodeKey);
//        return pastedKeys;
//    } else {
//        return [nodeKey];
//    }
//}

//export function quickWrap(model, nodeKey){
//    const {graph} = graphObject;
//    let newModel = fulex(model);
//    let quickKey = mapModel(graph, newModel, 0);
//    const resultKeys = fromBufferWrap(nodeKey, quickKey);
//    let childNode;
//    traverseGraphBranch(graph, quickKey, childKey => {
//        childNode = graph.node(childKey);
//        if(childNode){
//            delete childNode.modelNode;
//            graph.removeNode(childKey);
//        }
//    });
//    newModel = undefined;
//    quickKey = undefined;
//    return resultKeys;
//}

export function cloneSelected() {
	const {graph} = graphObject;
	const {selected} = getAllMarkedKeys();
	let pastedKeys = [];
	if (selected && selected.length > 0) {

		let clonedMap = new Map();
		let newNodeKey;
		selected.forEach(selectedKey => {
			const selectedNode = graph.node(selectedKey);
			if (selectedNode && !selectedNode.prop) {
				newNodeKey = copyGraphNode(graph, selectedKey);
				clonedMap.set(selectedKey, newNodeKey);
			}
		});

		clonedMap.forEach((newKey, targetKey) => {
			const parentKey = graph.parent(targetKey);
			let parentNode = graph.node(parentKey);
			const selectedNode = graph.node(targetKey);
			if (parentNode && selectedNode) {
				let detachedModelNodes = [];
				let detachedNode = graph.node(newKey);
				if (detachedNode && detachedNode.modelNode) {
					graph.setParent(newKey, parentKey);
					detachedModelNodes.push(detachedNode.modelNode);
					let {modelNode} = parentNode;
					modelNode.children = modelNode.children || [];
					let modelNodesArgs = [selectedNode.index + 1, 0].concat(detachedModelNodes);
					modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
					adjustIndices(graph, parentKey);
					pastedKeys.push(newKey);
				}

			}
		});
	}
	return pastedKeys;
}

export function moveSelected(isUp) {
	const {graph} = graphObject;
	const {selected} = getAllMarkedKeys();
	if (selected && selected.length > 0) {

		let parentMap = new Map();
		let parentKey;
		let childrenGroup;
		let child;
		selected.forEach(selectedKey => {
			child = graph.node(selectedKey);
			if (child) {
				parentKey = graph.parent(selectedKey);
				if (parentKey) {
					childrenGroup = parentMap.get(parentKey);
					if (!childrenGroup) {
						childrenGroup = [];
						parentMap.set(parentKey, childrenGroup);
					}
					childrenGroup.push(child);
				}
			}
		});
		let parentNode;
		parentMap.forEach((group, parentKey) => {
			parentNode = graph.node(parentKey);
			let {modelNode} = parentNode;
			if (modelNode.children && modelNode.children.length !== 1) {
				if (isUp) {
					group.sort((a, b) => a.index - b.index);
					for (let u = 0; u < group.length; u++) {
						if (group[u].index <= 0) {
							break;
						}
						modelNode.children.splice(group[u].index, 1);
						modelNode.children.splice(group[u].index - 1, 0, group[u].modelNode);
					}
				} else {
					group.sort((a, b) => b.index - a.index);
					for (let d = 0; d < group.length; d++) {
						if (group[d].index >= modelNode.children.length - 1) {
							break;
						}
						modelNode.children.splice(group[d].index, 1);
						modelNode.children.splice(group[d].index + 1, 0, group[d].modelNode);
					}
				}
				adjustIndices(graph, parentKey);
			}
		});
	}
}

export function deleteSelected() {
	const {graph, pageNodes} = graphObject;
	const testFunc = node => node.selected;
	let detachedKeys = [];
	let resultKeys = [];
	pageNodes.forEach(pNode => {
		traverseGraphBranch(graph, pNode.pageKey, (key => {
			let childNode = graph.node(key);
			if (childNode.selected) {
				const parentKey = graph.parent(key);
				if (parentKey) {
					//const parentNode = graph.node(parentKey);
					const childKeys = graph.children(parentKey);
					if (childKeys && childKeys.length > 1) {
						let children = [];
						childKeys.forEach(childKey => {
							children.push({key: childKey, node: graph.node(childKey)});
						});
						children.sort((a, b) => a.node.index - b.node.index);
						if (childNode.index === 0) {
							resultKeys.push(children[1].key);
						} else {
							resultKeys.push(children[childNode.index - 1].key);
						}
					} else {
						resultKeys.push(parentKey);
					}
				}
			}
		}));
		detachGraphNodes(graph, pNode.pageKey, testFunc, detachedKeys);
	});
	let newResultKeys = [];
	if (detachedKeys.length > 0) {
		resultKeys.forEach(key => {
			if (detachedKeys.indexOf(key) < 0) {
				newResultKeys.push(key);
			}
		});
		let childNode;
		detachedKeys.forEach(key => {
			traverseGraphBranch(graph, key, childKey => {
				childNode = graph.node(childKey);
				if (childNode) {
					delete childNode.modelNode;
					graph.removeNode(childKey);
				}
			});
		});
	}
	return newResultKeys;
}

export function changeModelNodeType(nodeKey, newModel) {
	const {graph} = graphObject;
	let node = graph.node(nodeKey);
	const parentKey = graph.parent(nodeKey);
	const detachedModel = fulex(newModel);
	if (node && parentKey) {
		traverseGraphBranch(graph, nodeKey, childKey => {
			if (childKey !== nodeKey) {
				let childNode = graph.node(childKey);
				if (childNode) {
					delete childNode.modelNode;
					graph.removeNode(childKey);
				}
			}
		});
		mapModelForNode(graph, detachedModel, node.index, undefined, undefined, nodeKey);
		let parentNode = graph.node(parentKey);
		let {modelNode} = parentNode;
		modelNode.children = modelNode.children || [];
		let modelNodesArgs = [node.index, 1].concat([detachedModel]);
		modelNode.children.splice.apply(modelNode.children, modelNodesArgs);
		adjustIndices(graph, parentKey);
	}
}

export function setForCutting(nodeKey) {
	const {graph} = graphObject;
	let node = graph.node(nodeKey);
	if (node) {
		node.isForCutting = true;
		traverseGraphBranch(graph, nodeKey, (key => {
			let childNode = graph.node(key);
			childNode.isForCuttingChild = true;
		}));
	}
}

export function removeForCutting(nodeKey) {
	const {graph} = graphObject;
	let node = graph.node(nodeKey);
	if (node) {
		node.isForCutting = undefined;
		traverseGraphBranch(graph, nodeKey, (key => {
			let childNode = graph.node(key);
			childNode.isForCuttingChild = undefined;
		}));
	}
}

export function setForCopying(nodeKey) {
	const {graph} = graphObject;
	let node = graph.node(nodeKey);
	if (node) {
		node.isForCopying = true;
	}
}

export function removeForCopying(nodeKey) {
	const {graph} = graphObject;
	let node = graph.node(nodeKey);
	if (node) {
		node.isForCopying = undefined;
	}
}

export function removeClipboardMarks(nodeKey) {
	removeForCutting(nodeKey);
	removeForCopying(nodeKey);
}

export function getMarkedKeys(rootKey) {
	let selected = [];
	let highlighted = [];
	let forCutting = [];
	let forCopying = [];
	const {graph} = graphObject;
	traverseGraphBranch(graph, rootKey, (key => {
		let childNode = graph.node(key);
		if (childNode) {
			if (childNode.highlighted) {
				highlighted.push(key);
			}
			if (childNode.selected) {
				selected.push(key);
			}
			if (childNode.isForCutting) {
				forCutting.push(key);
			}
			if (childNode.isForCopying) {
				forCopying.push(key);
			}
		}
	}));
	//console.log('Get marked keys, root: ' + rootKey +
	//    ', selected: ' + selected.length +
	//    ', highlighted: ' + highlighted.length +
	//    ', forCutting: ' + forCutting.length +
	//    ', forCopying: ' + forCopying.length);
	return {selected, highlighted, forCutting, forCopying};
}

export function getAllMarkedKeys() {
	const {graph, pageNodes} = graphObject;
	let result = undefined;
	pageNodes.forEach(pNode => {
		if (!result) {
			result = getMarkedKeys(pNode.pageKey);
		} else {
			const {selected, highlighted, forCutting, forCopying} = getMarkedKeys(pNode.pageKey);
			result.selected = result.selected.concat(selected);
			result.highlighted = result.highlighted.concat(highlighted);
			result.forCutting = result.forCutting.concat(forCutting);
			result.forCopying = result.forCopying.concat(forCopying);
		}
	});
	return result;
}
