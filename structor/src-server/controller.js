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

require('babel-register');
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';

import { config } from 'structor-commons';

import * as structorController from './structor/controller.js';
// import * as sandboxController from './sandbox/controller.js';
// import * as downloadController from './download/controller.js';

let server = {
  io: undefined,
  ioSocket: undefined,
  ioSocketClient: undefined,
  app: undefined,
  appServer: undefined,
  proxy: undefined
};

let serverDirPath = undefined;
let projectDirPath = undefined;

function printError (message, error) {
  if (message) {
    console.log(message);
  }
  console.error(error.message ? error.message : error);
}

function callControllerMethod (controller, req, res) {
  let methodName = req.body.methodName;
  let data = req.body.data || {};
  //console.log('Calling controller method: ' + methodName);
  if (controller[methodName]) {
    controller[methodName](data)
      .then(response => {
        if (response === undefined) {
          res.send({data: null});
        } else if (response.error) {
          res.send({error: true, errors: response.errors});
        } else {
          res.send({data: response});
        }
      })
      .catch(err => {
        let errorMessage = err.message ? err.message : err;
        res.send({error: true, errors: [errorMessage]});
      });
  } else {
    res.send({error: true, errors: ['Server does not have method: ' + methodName]});
  }
}

export function initServer (options) {
  const {serverDir, projectDir, portNumber, debugMode, io, host} = options;
  const hostname = host || 'localhost';
  serverDirPath = serverDir;
  projectDirPath = projectDir;
  return config.init(projectDir, serverDir, debugMode)
    .then(status => {
      if (status) {

        server.app = express();
        server.app.use('/structor', express.static(path.join(serverDirPath, 'static')));

        server.appServer = http.createServer(server.app);
        if (io) {
          server.ioSocket = io(server.appServer);
          server.ioSocket.on('connection', socket => {
            server.ioSocketClient = socket;
            server.ioSocketClient.emit('invitation', 'Hello from server.');
          });
        }

        server.appServer.listen(portNumber, hostname, () => {
          if (status === config.READY) {
            console.log('Structor has been started successfully.');
            console.log(`\nOpen in the browser: http://${hostname}:${portNumber}/structor\n`);
          }
        });

        // initDownloadController();
        if (status === config.READY) {
          initStructorController();
          // initSandboxController();
        }
      }
    })
    .catch(e => {
      printError('Error happened during server initialization:', e);
    });
}

function reinitServer () {
  return config.init(projectDirPath)
    .then(status => {
      if (status === config.READY) {
        initStructorController();
        // initSandboxController();
      } else {
        throw Error('Server reinitialization should not be provided in empty directory.');
      }
      return 'OK';
    });
}

// function initDownloadController(){
//     server.app.post('/structor-project-download', bodyParser.json({limit: '50mb'}), (req, res) => {
//         callControllerMethod(downloadController, req, res);
//     });
//     downloadController.setProjectDirPath(projectDirPath);
//     downloadController.setPostInstallationCallback(reinitServer);
// }

function initStructorController () {
  server.app.post('/structor-invoke', bodyParser.json({limit: '50mb'}), (req, res) => {
    callControllerMethod(structorController, req, res);
  });
  structorController.setServer(server);
}
//
// function initSandboxController(){
//     server.app.post('/structor-sandbox', bodyParser.json({limit: '50mb'}), (req, res) => {
//         callControllerMethod(sandboxController, req, res);
//     });
//     sandboxController.setServer(server);
// }
