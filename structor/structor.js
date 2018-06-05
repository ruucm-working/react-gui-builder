#!/usr/bin/env node

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

var minimist = require('minimist');
var path = require('path');
var io = require('socket.io');
var controller = require('./server/controller.js');

process.on('uncaughtException',
    function(err){
        if(err.code === 'EADDRINUSE'){
            console.error('Port is already in use, you can set another port using option: -p <YOUR_PORT>.');
        } else {
            console.log(err);
        }
    }
);

var argv = minimist(process.argv.slice(2));

var portNumber = 2222;
if(argv['p']){
    var tryPort = parseInt(argv['p']);
    if(tryPort && tryPort > 1024 && tryPort < 65000){
        portNumber = tryPort;
    }
}

var host = argv['h'] || 'localhost';

var workingDir = process.cwd();
if(argv['d']){
    if(path.isAbsolute(argv['d'])){
        workingDir = argv['d'];
    } else {
        workingDir = path.resolve(workingDir, argv['d']);
    }
}

var debugMode = argv['v'];

controller.initServer({ serverDir: __dirname, projectDir: workingDir, portNumber: portNumber, debugMode: debugMode, io: io, host: host });
