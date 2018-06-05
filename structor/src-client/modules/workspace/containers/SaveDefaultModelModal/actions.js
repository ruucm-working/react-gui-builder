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
import { bindActionCreators } from 'redux';

export const HIDE_MODAL = "SaveDefaultModelModal/HIDE_MODAL";
export const SHOW_MODAL = "SaveDefaultModelModal/SHOW_MODAL";
export const SAVE_COMPONENT_DEFAULTS = "SaveDefaultModelModal/SAVE_COMPONENT_DEFAULTS";

export const hideModal = () => ({type: HIDE_MODAL});

export const showModal = ()  => (dispatch, getState) => {
    dispatch({type: SHOW_MODAL});
};

export const submit = (currentComponent, variantName) => (dispatch, getState) => {
    const {componentName, namespace, defaults, props, text, children} = currentComponent;
    let newDefaults = defaults && defaults.length > 0 ? cloneDeep(defaults) : [];
    let foundExisting = newDefaults.find(i => i.variant === variantName);
    if (foundExisting) {
        foundExisting.variant = variantName;
        foundExisting.props = props || {};
        foundExisting.text = text;
        foundExisting.children = children || [];
    } else {
        newDefaults.push({
            type: componentName,
            namespace: namespace,
            variant: variantName,
            props: props || {},
            text: text,
            children: children || []
        })
    }
    dispatch(saveComponentDefaults(componentName, namespace, newDefaults));
};

export const saveComponentDefaults = (componentName, namespace, defaults) => (dispatch, getState) => {
    dispatch({type: SAVE_COMPONENT_DEFAULTS, payload: {componentName, namespace, defaults}});
};

export const containerActions = (dispatch) => bindActionCreators({
    hideModal, submit
}, dispatch);
