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

import fs from 'fs-extra';
import request from 'request';

let authenticationToken = null;

export function setAuthenticationToken(token) {
    authenticationToken = token;
}

export function post(url, requestBody) {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            uri: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Auth-Token': authenticationToken
            },
            method: 'POST',
            json: true,
            body: requestBody,
            followAllRedirects: false
        };
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                post(response.headers.location, requestBody)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 413) {
                                reject('The files content is too large. Make sure that overall size of posted files is less than 1M.');
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden. Please sign in to Structor Market.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated. Please sign in to Structor Market.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Status: ' + response.statusMessage + '. Message: ' + JSON.stringify(body));
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + '. ' + (error.message ? error.message : error));
                        } else {
                            if (body.error === true) {
                                let errorMessage = "Error: ";
                                if (body.errors && body.errors.length > 0) {
                                    body.errors.map(errorStr => {
                                        errorMessage += errorStr + ', ';
                                    });
                                }
                                reject(errorMessage.substr(0, errorMessage.length - 2));
                            } else {
                                resolve(body);
                            }
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}

export function get(url) {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            headers: {
                'Accept': 'application/json',
                'X-Auth-Token': authenticationToken
            },
            uri: url,
            method: 'GET',
            json: true,
            followAllRedirects: false
        };
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                get(response.headers.location)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden. Please sign in to Structor Market.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated. Please sign in to Structor Market.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Status: ' + response.statusMessage + '. Message: ' + JSON.stringify(body));
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + ". " + (error.message ? error.message : error));
                        } else {
                            resolve(body);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}

export function getText(url) {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            headers: {
                'X-Auth-Token': authenticationToken
            },
            uri: url,
            method: 'GET',
            json: false
        };
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                getText(response.headers.location)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden. Please sign in to Structor Market.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated. Please sign in to Structor Market.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Status: ' + response.statusMessage + '. Message: ' + JSON.stringify(body));
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + '. ' + (error.message ? error.message : error));
                        } else {
                            resolve(body);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}

export function download(url, requestBody) {
    return new Promise((resolve, reject) => {
        let requestOptions = {
            uri: url,
            headers: {
                'Content-type': 'application/json',
                'X-Auth-Token': authenticationToken
            },
            method: 'POST',
            body: JSON.stringify(requestBody),
            encoding: null
        };
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                download(response.headers.location, requestBody)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden. Please sign in to Structor Market.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated. Please sign in to Structor Market.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Status: ' + response.statusMessage + '. Message: ' + JSON.stringify(body));
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + '. ' + (error.message ? error.message : error));
                        } else {
                            resolve(body);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}

export function downloadGet(url) {
    return new Promise((resolve, reject) => {
        let requestOptions = {
            uri: url,
            method: 'GET',
            strictSSL: false,
            headers: {
                'User-Agent': 'request'
            },
            encoding: null
        };
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                downloadGet(response.headers.location)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Error: ' + response.statusMessage);
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + '. ' + (error.message ? error.message : error));
                        } else {
                            resolve(body);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}

export function uploadFile(url, filePath, fieldName) {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            uri: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Auth-Token': authenticationToken
            },
            method: 'POST',
            followAllRedirects: false,
            formData: {}
        };
        requestOptions.formData[fieldName] = fs.createReadStream(filePath);
        try {
            request(
                requestOptions,
                (error, response, body) => {
                    if (response) {

                        if (response.statusCode !== 200) {
                            if (response.statusCode >= 301 && response.statusCode <= 302) {
                                post(response.headers.location, requestBody)
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            } else if (response.statusCode === 403) {
                                reject('User account is not signed in. Requested operation is forbidden. Please sign in to Structor Market.');
                            } else if (response.statusCode === 401) {
                                reject('User account is not authenticated. Please sign in to Structor Market.');
                            } else if (response.statusCode === 502) {
                                reject('Connection to Structor Market server can not be established. Please try a little bit later.');
                            } else {
                                reject('Got error code ' + response.statusCode + ' for ' + url + '. Status: ' + response.statusMessage + '. Message: ' + JSON.stringify(body));
                            }
                        } else if (error) {
                            reject('Error connection to ' + url + '. ' + (error.message ? error.message : error));
                        } else {
                            if (body.error === true) {
                                let errorMessage = "Error: ";
                                if (body.errors && body.errors.length > 0) {
                                    body.errors.map(errorStr => {
                                        errorMessage += errorStr + ', ';
                                    });
                                }
                                reject(errorMessage.substr(0, errorMessage.length - 2));
                            } else {
                                resolve(body);
                            }
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )
        } catch (e) {
            reject(e.message ? e.message : e);
        }
    });
}
