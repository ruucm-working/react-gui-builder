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
import 'isomorphic-fetch';

export function makeRequest(url, method, options = {}){

    let fetchOptions = {
        method: 'POST',
        headers:         {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    if(options){
        fetchOptions.body = JSON.stringify({
            methodName: method,
            data: options
        });
    }
    return fetch(url, fetchOptions)
        .then( response => {
            //console.log('Received response: ' + JSON.stringify(response, null, 4));
            //console.log('Received response: ' + response.status);
            //console.log('Received response: ' + response.statusText);
            //console.log(response.headers.get('Content-Type'));
            if (response.status >= 200 && response.status < 300) {

                return response.text()
                    .then(responseText => {
                        //console.log('Server response: ' + responseText);
                        let jsonData = undefined;
                        try{
                            jsonData = JSON.parse(responseText);
                        } catch(e){
                        }
                        if(jsonData.error === true){
                            let errorText = '';
                            if(_.isArray(jsonData.errors)){
                                jsonData.errors.forEach(errText => {
                                    errorText += '\n' + errText;
                                });
                            } else {
                                errorText = JSON.stringify(jsonData.errors);
                            }
                            throw Error(errorText);
                        } else if(jsonData.data !== undefined){
                            jsonData = jsonData.data;
                        }
                        return jsonData;
                    });
            } else {
                throw Error(response.statusText);
            }
        });

}

export function invokeStructor(method, options){
    return makeRequest('/structor-invoke', method, options);
}
