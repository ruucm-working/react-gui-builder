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

import express from 'express';
import rewrite from 'express-urlrewrite';
import httpProxy from 'http-proxy';
import { sortBy } from 'lodash';
import marked from 'marked';
import { config, storage, commons, gengine } from 'structor-commons';
import * as gengineManager from '../commons/gengine';
import * as middlewareCompilerManager from './middlewareCompilerManager.js';
import * as extractManager from './extractManager.js';
import * as installManager from './installManager.js';

export const STRUCTOR_URLS = [
  '/structor',
  '/structor-invoke',
  '/structor-sandbox',
  '/structor-deskpage',
  '/structor-dev',
  '/structor-desk',
  '/structor-sandbox-preview',
  '/structor-sandbox-screenshot',
  '/structor-gengine-scaffolds'
];

let serverRef = undefined;
let proxy = undefined;

export function loopback (options) {
  return Promise.resolve('Response: ' + options.message);
}

export function error (options) {
  return Promise.reject('Response: ' + options.message);
}

export function setServer (server) {
  serverRef = server;
  if (config.status() === config.READY) {
    initServer();
    initProxyServer();
  }
}

function initServer () {
  if (serverRef) {
    serverRef.app.use(middlewareCompilerManager.getDevMiddleware());
    serverRef.app.use(middlewareCompilerManager.getHotMiddleware());
    serverRef.app.use(middlewareCompilerManager.getBuilderMiddleware({
      callback: stats => {
        if (serverRef.ioSocketClient) {
          serverRef.ioSocketClient.emit('compiler.message', stats);
        }
      }
    }));
    serverRef.app.use(rewrite('/structor-deskpage/*', '/structor-desk/index.html'));
    serverRef.app.use('/structor-desk', express.static(config.deskDirPath()));
    serverRef.app.use('/structor-gengine-scaffolds', express.static(config.scaffoldsDirPath()));
  }
}

function initProxyServer () {
  if (serverRef) {
    if (!proxy) {
      proxy = httpProxy.createProxyServer({});
      proxy.on('error', (err, req, res) => {
        const statusText = 'Proxy server error connecting to ' + config.projectProxyURL() + req.url + ' ' + (err.message ? err.message : err);
        res.writeHead(500, statusText);
        res.end(statusText);
        console.error(statusText);
      });
      proxy.on('proxyReq', () => {
        let projectProxyURL = config.projectProxyURL();
        if (projectProxyURL) {
          const proxyURL = projectProxyURL.replace('http://', '');
          return (proxyReq, req, res, options) => {
            proxyReq.setHeader('X-Forwarded-Host', proxyURL);
          };
        }
      });
      //
      serverRef.app.all('/*', (req, res, next) => {
        let url = req.url;
        if (checkDeniedProxyURL(url)) {
          next('route');
        } else {
          let proxyURL = config.projectProxyURL();
          if (proxyURL && proxyURL.length > 0 && url.indexOf(proxyURL) >= 0) {
            proxy.web(req, res, {target: proxyURL});
          } else {
            // all other requests redirect to deskpage
            res.redirect('/structor-deskpage' + url.replace('http://', ''));
          }
        }
      });
    }
  }
}

function checkDeniedProxyURL (textUrl) {
  let isDenied = false;
  if (textUrl) {
    for (let i = 0; i < STRUCTOR_URLS.length; i++) {
      if (textUrl.indexOf(STRUCTOR_URLS[i]) === 0) {
        isDenied = true;
        break;
      }
    }
  }
  return isDenied;
}

export function getModel () {
  return storage.readProjectJsonModel();
}

export function getConfig () {

  return Promise.resolve(config.asObject());
}

export function getProjectStatus () {
  return Promise.resolve(config.status());
}

export function setProxyURL (options) {
  return config.projectProxyURL(options.proxyURL)
    .then(() => {
      initProxyServer();
    });
}

export function getComponentTree () {
  return storage.getComponentTree();
}

export function writeComponentDefaults (options) {
  const {componentName, namespace, defaults} = options;
  return storage.writeComponentDefaults(componentName, namespace, defaults);
}

export function getComponentNotes (options) {
  const {componentName, namespace} = options;
  return storage.readComponentDocument(componentName, namespace)
    .then(readmeText => {
      let propNames = [];
      if (readmeText && readmeText.length > 0) {
        marked(readmeText, {
          highlight: function (code) {
            if (code && code.length > 0 && code.indexOf(`${componentName}.propTypes`) >= 0) {
              const ast = commons.parse(code);
              propNames = commons.getObjectAssignmentPropNames(ast);
            }
          }
        });
      }
      return {readmeText, propNames};
    });
}

export function getComponentSourceCode (options) {
  return storage.readComponentSourceCode(options.filePath);
}

export function writeComponentSourceCode (options) {
  return storage.writeComponentSourceCode(options.filePath, options.sourceCode);
}

export function saveProjectModel (options) {
  return storage.writeProjectJsonModel(options.model);
}

export function pregenerate (options) {
  const {generatorName, generatorDirPath, namespace, componentName, model} = options;
  let generatorData = {
    namespace,
    componentName,
    model,
    project: config.getProjectConfig(),
  };
  return storage.getComponentTree()
    .then(index => {
      generatorData.index = index;
      return gengineManager.preProcess(generatorDirPath, generatorData);
    });
}

export function generate (options) {
  const {generatorName, generatorDirPath, namespace, componentName, model, metadata} = options;
  let generatorData = {
    namespace,
    componentName,
    model,
    metadata,
    project: config.getProjectConfig(),
  };
  return storage.getComponentTree()
    .then(index => {
      generatorData.index = index;
      return gengineManager.process(generatorDirPath, generatorData);
    });
}

export function generateApplication (options) {
  const generatorDirPath = config.applicationGeneratorDirPath();
  const {pagesModel, hasApplicationFiles} = options;
  let generatorData = {
    pagesModel,
    hasApplicationFiles,
    project: config.getProjectConfig(),
  };
  return storage.getComponentTree()
    .then(index => {
      generatorData.index = index;
      return gengineManager.process(generatorDirPath, generatorData);
    })
    .then(generatedObject => {
      const {files, dependencies} = generatedObject;
      return storage.saveGenerated(dependencies, files);
    });
}

export function saveGenerated (options) {
  const {files, dependencies} = options;
  return storage.saveGenerated(dependencies, files);
}

export function preExtractNamespaces (options) {
  const {namespaces, pages} = options;
  return extractManager.getAllDependencies(namespaces, pages);
}

export function extractNamespaces (options) {
  const {namespaces, dependencies, pages, dirPath} = options;
  return extractManager.extractNamespaces(namespaces, dependencies, pages, dirPath);
}

export function getMarketList (options) {
  return installManager.getMarketList();
}

export function getGHRepoInfo (options) {
  const {gitHubRepo, gitHubOwner} = options;
  return installManager.getGHRepoInfo(gitHubRepo, gitHubOwner);
}

export function preInstall (options) {
  const {dirPath, url} = options;
  return installManager.preInstall(dirPath, url);
}

export function cancelInstall (options) {
  return installManager.cleanDistr();
}

export function installFromLocalDir (options) {
  const {dirPath} = options;
  return installManager.installFromDir(dirPath);
}

export function getScaffoldGenerators (options) {
  const scaffoldsUrlPrefix = '/structor-gengine-scaffolds';
  const rootDir = config.scaffoldsDirPath();
  return storage.getScaffoldGenerators()
    .then(generators => {
      if (generators && generators.length > 0) {
        generators.forEach(generator => {
          generator.screenshotFilePath = generator.screenshotFilePath.replace(rootDir, scaffoldsUrlPrefix);
        });
        generators = sortBy(generators, ['name']);
      }
      return generators;
    });
}