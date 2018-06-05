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

import { Graph } from 'graphlib';
import { fulex } from '../utils/utils.js';

import { mapModel, makeNodeWrapper } from './graphUtils.js';

let previewGraph;

export function initGraph(initialModelsMap){
    if(initialModelsMap){
        previewGraph = new Graph({ compound: true });
        let variantKey;
        initialModelsMap.forEach((value, key) => {
            const model = fulex(value);
            if(model && model.length > 0){
                previewGraph.setNode(key, model);
                model.forEach((modelNode, index) => {
                    variantKey = mapModel(previewGraph, modelNode, index);
                    previewGraph.setParent(variantKey, key);
                })
            }
        });
    }
}

export function getVariantKeys(componentKey){
    const children = previewGraph.children(componentKey);
    return children && children.length > 0 ? children : [];
}

export function getWrappedModelForVariant(variantKey){
    return traverseGraph(variantKey);
}

export function getModelForVariant(variantKey){
    let node = previewGraph.node(variantKey);
    if(node){
        return node.modelNode;
    }
    return undefined;
}

function traverseGraph(rootNodeKey, result){
    let rootNode = previewGraph.node(rootNodeKey);
    if(rootNode){
        let resultNode = makeNodeWrapper(rootNodeKey, rootNode);
        let children = previewGraph.children(rootNodeKey);
        if(children && children.length > 0){
            children.forEach(child => {
                traverseGraph(child, resultNode);
            });
            if(resultNode.children && resultNode.children.length > 0){
                resultNode.children.sort((a, b) => a.index - b.index);
            }
        }
        if(!result){
            result = resultNode;
        } else if(rootNode.prop){
            result.props = result.props || {};
            result.props[rootNode.prop] = resultNode;
        } else {
            result.children = result.children || [];
            result.children.push(resultNode);
        }
    }
    return result;
}