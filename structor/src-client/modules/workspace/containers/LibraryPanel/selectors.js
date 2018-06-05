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

import {forOwn, uniq} from 'lodash';
import { createStructuredSelector, createSelector } from 'reselect';

export const componentTreeSelector = state => state.libraryPanel.componentTree;

export const componentNamesSelector = createSelector(
    componentTreeSelector,
    (tree) => {
        let result = [];
        if (tree.htmlComponents) {
            result = result.concat(Object.keys(tree.htmlComponents));
        }
        if (tree.components) {
            result = result.concat(Object.keys(tree.components));
        }
        if (tree.modules) {
            let moduleKeys;
            forOwn(tree.modules, (value, prop) => {
                if (value.components) {
                    moduleKeys = Object.keys(value.components);
                    result = result.concat(moduleKeys.map(name => `${name} [${prop}]`));
                }
            });
        }
        return result;
    }
);

export const availableComponentNamesSelector = createSelector(
    componentTreeSelector,
    (tree) => {
        let result = [];
        if (tree.components) {
            result = result.concat(Object.keys(tree.components));
        }
        if (tree.modules) {
            let moduleKeys;
            forOwn(tree.modules, (value, prop) => {
                if (value.components) {
                    moduleKeys = Object.keys(value.components);
                    result = result.concat(moduleKeys);
                }
            });
        }
        return uniq(result);
    }
);

export const availableNamespacesSelector = createSelector(
    componentTreeSelector,
    (tree) => {
        let result = [];
        if (tree.modules) {
            result = result.concat(Object.keys(tree.modules));
        }
        return result;
    }
);

export const modelSelector = createStructuredSelector({
    componentModel: state => state.libraryPanel
});

