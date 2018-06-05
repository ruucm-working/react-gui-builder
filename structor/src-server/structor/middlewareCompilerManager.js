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
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackBuilderMiddleware from './webpackBuilderMiddleware.js';
import { config } from 'structor-commons';

let compiler = undefined;
let devMiddleware = undefined;
let hotMiddleware = undefined;
let builderMiddleware = undefined;
let webpackConfig = undefined;

export function getDevMiddlewareCompiler () {
  if (compiler === undefined) {
    try {
      webpackConfig = require(config.webpackConfigFilePath());
      webpackConfig = cloneDeep(webpackConfig);
      compiler = webpack(webpackConfig);
      if (config.getDebugMode()) {
        console.log('Webpack configuration:');
        console.log(JSON.stringify(webpackConfig, null, 4));
      }
    } catch (e) {
      throw Error('Webpack config was not found. ' + e);
    }

  }
  return compiler;
}

export function getDevMiddleware () {
  if (devMiddleware === undefined) {
    devMiddleware = webpackDevMiddleware(
      getDevMiddlewareCompiler(),
      {
        noInfo: !config.getDebugMode(),
        quiet: !config.getDebugMode(),
        lazy: false,
        publicPath: webpackConfig ? webpackConfig.output.publicPath : '/structor-dev/__build__'
      }
    );
  }
  return devMiddleware;
}

export function getHotMiddleware () {
  if (hotMiddleware === undefined) {
    hotMiddleware = webpackHotMiddleware(
      getDevMiddlewareCompiler(),
      {
        log: console.log,
        overlay: false,
        reload: true,
        noInfo: false,
        quiet: false,
        path: '/structor-dev/a'
        // dynamicPublicPath: true
      }
    );
  }
  return hotMiddleware;
}

export function getBuilderMiddleware (opts) {
  if (builderMiddleware === undefined) {
    builderMiddleware = webpackBuilderMiddleware(
      getDevMiddlewareCompiler(),
      opts
    );
  }
  return builderMiddleware;
}


