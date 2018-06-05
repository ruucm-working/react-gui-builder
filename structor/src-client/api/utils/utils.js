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

import _ from 'lodash';
import cookies from './cookies.js';

export function fulfil(obj1, obj2) {
    if (_.isArray(obj2)) {
        if (!obj1 || obj1 == null) {
            obj1 = [];
            for (let i = 0; i < obj2.length; i++) {
                obj1.push(fulfil(null, obj2[i]));
            }
        }
    } else if (_.isObject(obj2)) {
        if (!obj1) {
            obj1 = {};
        }
        let items = Object.getOwnPropertyNames(obj2);
        for (let item = 0; item < items.length; item++) {
            obj1[items[item]] = fulfil(obj1[items[item]], obj2[items[item]]);
        }
    } else {
        if (obj1 == undefined) {
            obj1 = obj2;
        }
    }
    return obj1;
}

export function fulex(obj2) {
    let obj1 = null;
    if (_.isArray(obj2)) {
        obj1 = [];
        for (let i = 0; i < obj2.length; i++) {
            obj1.push(fulex(obj2[i]));
        }
    } else if (_.isObject(obj2)) {
        obj1 = {};
        for (let item in obj2) {
            if (obj2.hasOwnProperty(item)) {
                obj1[item] = fulex(obj2[item]);
            }
        }
    } else {
        obj1 = obj2;
    }
    return obj1;
}

export function delex(obj, path) {
    let pathArray = path.split('.');
    if (pathArray.length === 1 && obj[path] !== undefined) {
        delete obj[path];
    } else {
        let tempObj = obj;
        pathArray.map(function (step, index) {
            if (index === pathArray.length - 1 && tempObj[step] !== undefined) {
                delete tempObj[step];
            } else {
                tempObj = tempObj[step];
            }
        });
    }
    return obj;
}

export function cleanex(obj2) {
    let obj1 = null;
    let tempObj = null;
    if (_.isArray(obj2)) {
        obj1 = [];
        for (let i = 0; i < obj2.length; i++) {
            tempObj = cleanex(obj2[i]);
            if (_.isObject(tempObj)) {
                if (!_.isEmpty(tempObj)) {
                    obj1.push(tempObj);
                }
            } else {
                obj1.push(tempObj);
            }
        }
    } else if (_.isObject(obj2)) {
        obj1 = {};
        for (let item in obj2) {
            if (obj2.hasOwnProperty(item)) {
                tempObj = cleanex(obj2[item]);
                if (_.isObject(tempObj)) {
                    if (!_.isEmpty(tempObj)) {
                        obj1[item] = tempObj;
                    }
                } else {
                    obj1[item] = tempObj;
                }
            }
        }
    } else {
        if (_.isObject(obj2)) {
            if (!_.isEmpty(obj2)) {
                obj1 = obj2;
            }
        } else {
            obj1 = obj2;
        }
    }
    return obj1;
}

export function isVisible(element) {
    let invisibleParent = false;
    if ($(element).css("display") === "none") {
        invisibleParent = true;
    } else {
        $(element).parents().each(function (i, el) {
            if ($(el).css("display") === "none") {
                invisibleParent = true;
                return false;
            }
            return true;
        });
    }
    return !invisibleParent;
}

export function trimComponentName(label, width = 50){
    if(label.length > width){
        label = label.substr(0, width) + '...';
    }
    return label;
}

export function cleanPropsUmyId(modelItem) {
    if (modelItem.props && modelItem.props['data-umyid']) {
        modelItem.props['data-umyid'] = undefined;
        delete modelItem.props['data-umyid'];
    }
    _.forOwn(modelItem.props, (value, prop) => {
        if (_.isObject(value) && value.type) {
            cleanPropsUmyId(value);
        }
    });
    if (modelItem.children && modelItem.children.length > 0) {
        for (let i = 0; i < modelItem.children.length; i++) {
            cleanPropsUmyId(modelItem.children[i]);
        }
    }
}

export function saveCookiesObject(key, obj){
    const stringRepresentation = JSON.stringify(obj);
    cookies.setItem(key, stringRepresentation, 31536e3, "/");
}

export function retrieveCookiesObject(key){
    const stringRepresentation = cookies.getItem(key);
    let result = undefined;
    if(stringRepresentation){
        try{
            result = JSON.parse(stringRepresentation);
        } catch(e){
            console.warn('Cookies has been corrupted.');
        }
    }
    return result;
}
