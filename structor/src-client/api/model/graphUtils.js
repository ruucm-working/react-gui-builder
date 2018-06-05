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

import { uniqueId, forOwn, isObject } from 'lodash';
import { fulex } from '../utils/utils.js';

export function mapModel(srcGraph, rootModelNode, rootIndex, isNew, prop) {
    const rootKey = uniqueId();
    srcGraph.setNode(rootKey, { modelNode: rootModelNode, index: rootIndex, prop });
    forOwn(rootModelNode.props, (value, prop) => {
        if (isObject(value) && value.type) {
            const childKey = mapModel(srcGraph, value, 0, isNew, prop);
            srcGraph.setParent(childKey, rootKey);
        }
    });
    const { children } = rootModelNode;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            const childKey = mapModel(srcGraph, children[i], i, isNew);
            srcGraph.setParent(childKey, rootKey);
        }
    }
    return rootKey;
}

export function mapModelForNode(srcGraph, rootModelNode, rootIndex, isNew, prop, rootKey) {
    srcGraph.setNode(rootKey, { modelNode: rootModelNode, index: rootIndex, prop });
    forOwn(rootModelNode.props, (value, prop) => {
        if (isObject(value) && value.type) {
            const childKey = mapModel(srcGraph, value, 0, isNew, prop);
            srcGraph.setParent(childKey, rootKey);
        }
    });
    const { children } = rootModelNode;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            const childKey = mapModel(srcGraph, children[i], i, isNew);
            srcGraph.setParent(childKey, rootKey);
        }
    }
    return rootKey;
}

export function makeNodeWrapper(key, graphNode){
    return {
        key: key,
        modelNode: graphNode.modelNode,
        index: graphNode.index,
        prop: graphNode.prop,
        selected: graphNode.selected,
        highlighted: graphNode.highlighted,
        isForCutting: graphNode.isForCutting,
        isForCuttingChild: graphNode.isForCuttingChild,
        isForCopying: graphNode.isForCopying
    };
}

export function traverseGraphBranch(srcGraph, rootKey, cbFunc){
    const children = srcGraph.children(rootKey);
    if(children && children.length){
        children.forEach(key => {
            traverseGraphBranch(srcGraph, key, cbFunc);
        });
    }
    if(cbFunc){
        cbFunc(rootKey);
    }
}

export function adjustIndices(srcGraph, nodeKey){
    const parentNode = srcGraph.node(nodeKey);
    const parentChildren = srcGraph.children(nodeKey);
    if(parentNode && parentChildren && parentChildren.length > 0){
        let childNode;
        parentChildren.forEach(childKey => {
            childNode = srcGraph.node(childKey);
            if(childNode){
                if(childNode.prop){
                    childNode.index = 0;
                } else if(parentNode.modelNode.children && parentNode.modelNode.children.length > 0){
                    childNode.index = parentNode.modelNode.children.indexOf(childNode.modelNode);
                } else {
                    childNode.index = 0;
                }
            }
        });
    }
}

export function detachGraphNode(srcGraph, nodeKey){
    let cutNode = srcGraph.node(nodeKey);
    if(!cutNode){
        throw Error('Detach graph node: node key ' + nodeKey + ' was not found.');
    }
    const parentNodeKey = srcGraph.parent(nodeKey);
    if(parentNodeKey){
        let parentNode = srcGraph.node(parentNodeKey);
        if(parentNode && parentNode.modelNode){
            let { modelNode: parentModelNode } = parentNode;
            if(cutNode.prop){
                if(!parentModelNode.props[cutNode.prop]){
                    throw Error('Detach graph node: model node with key ' + parentNodeKey + ' does not have prop ' + cutNode.prop);
                }
                parentModelNode.props[cutNode.prop] = undefined;
                cutNode.prop = undefined;
            } else if(parentModelNode.children && parentModelNode.children.length > 0) {
                const childIndex = parentModelNode.children.indexOf(cutNode.modelNode);
                if (childIndex < 0) {
                    throw Error('Detach graph node: child model node with key ' + nodeKey + ' does not belong to parent node with key ' + parentNodeKey);
                }
                parentModelNode.children.splice(childIndex, 1);
            } else {
                throw Error('Detach graph node: parent node ' + parentNodeKey + ' does not have children or needed prop.');
            }
            adjustIndices(srcGraph, parentNodeKey);
        } else {
            throw Error('Detach graph node: parent node ' + parentNodeKey + ' is missing or does not have linked modelNode.')
        }
        srcGraph.setParent(nodeKey, undefined);
    }
    return nodeKey;
}

export function detachGraphNodes(srcGraph, rootNodeKey, testFunc, detachedKeys){
    detachedKeys = detachedKeys || [];
    const parentNode = srcGraph.node(rootNodeKey);
    if(parentNode){
        let childKeys = srcGraph.children(rootNodeKey);
        if(testFunc(parentNode)){
            detachedKeys.push(detachGraphNode(srcGraph, rootNodeKey));
        }
        if(childKeys && childKeys.length > 0){
            let sortedChildrenNodes = [];
            let propChildrenNodes = [];
            let childNode;
            childKeys.forEach(childKey => {
                childNode = srcGraph.node(childKey);
                if(childNode){
                    if(childNode.prop){
                        propChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    } else {
                        sortedChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    }
                }
            });
            if(sortedChildrenNodes.length > 0){
                sortedChildrenNodes.sort((a, b) => a.node.index - b.node.index);
            }
            propChildrenNodes.forEach(childNode => {
                detachGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
            sortedChildrenNodes.forEach(childNode => {
                detachGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
        }
    }
}

export function copyGraphNode(srcGraph, nodeKey){
    let copyNode = srcGraph.node(nodeKey);
    if(!copyNode){
        throw Error('Copy graph node: node key ' + nodeKey + ' was not found.');
    }
    let newModelNode = fulex(copyNode.modelNode);
    return mapModel(srcGraph, newModelNode, 0, true);
}

export function copyGraphNodes(srcGraph, rootNodeKey, testFunc, detachedKeys){
    detachedKeys = detachedKeys || [];
    const parentNode = srcGraph.node(rootNodeKey);
    if(parentNode){
        let childKeys = srcGraph.children(rootNodeKey);
        if(testFunc(parentNode)){
            detachedKeys.push(copyGraphNode(srcGraph, rootNodeKey));
        }
        if(childKeys && childKeys.length > 0){
            let sortedChildrenNodes = [];
            let propChildrenNodes = [];
            let childNode;
            childKeys.forEach(childKey => {
                childNode = srcGraph.node(childKey);
                if(childNode){
                    if(childNode.prop){
                        propChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    } else {
                        sortedChildrenNodes.push({
                            key: childKey,
                            node: childNode
                        });
                    }
                }
            });
            if(sortedChildrenNodes.length > 0){
                sortedChildrenNodes.sort((a, b) => a.node.index - b.node.index);
            }
            propChildrenNodes.forEach(childNode => {
                copyGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
            sortedChildrenNodes.forEach(childNode => {
                copyGraphNodes(srcGraph, childNode.key, testFunc, detachedKeys);
            });
        }
    }
}
