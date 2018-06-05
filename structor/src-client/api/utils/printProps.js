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

const lineTemplate = _.template(
`<%= processProps(props) %>`);

function processStyle(styleObject){
    var result = '';
    if(styleObject && !_.isEmpty(styleObject)){
        _.forOwn(styleObject, function(value, prop){
            if(_.isString(value) && value.length > 0){
                result += ' ' + prop + ": '" + value + "',";
            } else if(_.isBoolean(value) || _.isNumber(value)){
                result += ' ' + prop + ": " + value + ",";
            }
        });
        result = result.substr(0, result.length - 1);
    }
    return result;
}

function processProps(props){

    var result = '';
    if(props && !_.isEmpty(props)){
        _.forOwn(props, function(value, prop){
            if(_.isString(value) && value.length > 0){
                result += prop + "=\"" + value + "\" ";
            } else if(_.isBoolean(value) || _.isNumber(value)){
                result += prop + "={" + value + "} ";
            } else if(_.isArray(value)){
                var arrayString = '';
                _.forEach(value, function(item){
                    if(_.isObject(item)){
                        arrayString += '{ ' + processStyle(item) + ' },';
                    } else {
                        if(_.isString(item) && item.length > 0){
                            arrayString += "\'" + item + "\',";
                        } else if(_.isBoolean(item) || _.isNumber(item)){
                            arrayString += item + ',';
                        }
                    }
                });
                result += prop + '={[ ' + arrayString.substr(0, arrayString.length - 1) + ']} ';
            } else if(_.isObject(value)){
                if(value['type']){
                    result += prop +"={ " + value.type + " } ";
                } else {
                    result += prop + "={{ " + processStyle(value) + " }} ";
                }
            }
        });
    }
    return result;
}


export function printProps(props){
    return lineTemplate({props, processProps, processStyle});
}

