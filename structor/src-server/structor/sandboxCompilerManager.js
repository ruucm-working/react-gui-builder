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

import path from 'path';
import { cloneDeep } from 'lodash';
import webpack from 'webpack';
import { config } from 'structor-commons';

let sandboxCompiler = undefined;
let sandboxWebpackConfig = undefined;

export function compileSandbox () {
  if (sandboxCompiler === undefined) {
    try {
      sandboxWebpackConfig = require(config.webpackConfigFilePath());
      sandboxWebpackConfig = cloneDeep(sandboxWebpackConfig);
      const entryFilePath = path.join(config.sandboxDirPath(), 'index.js');
      const outputDirPath = config.sandboxDirPath();
      const outputFileName = 'bundle.js';
      sandboxWebpackConfig.entry = [entryFilePath];
      sandboxWebpackConfig.output = {
        path: outputDirPath,
        filename: outputFileName
      };
      sandboxWebpackConfig.resolve = sandboxWebpackConfig.resolve || {};
      sandboxWebpackConfig.resolve.modules = [config.SANDBOX_DIR, 'node_modules'];
      sandboxWebpackConfig.stats = 'errors-only';
      sandboxCompiler = webpack(sandboxWebpackConfig);
    } catch (e) {
      throw Error('Webpack config was not found. ' + e);
    }

  }
  return new Promise((resolve, reject) => {
    sandboxCompiler.run((err, stats) => {
      let jsonStats = stats.toJson({
        // Add asset Information
        assets: false,
        // Sort assets by a field
        assetsSort: 'field',
        // Add information about cached (not built) modules
        cached: false,
        // Add children information
        children: false,
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,
        // Add built modules information to chunk information
        chunkModules: false,
        // Add the origins of chunks and chunk merging info
        chunkOrigins: false,
        // Sort the chunks by a field
        chunksSort: 'field',
        // `webpack --colors` equivalent
        colors: false,
        // Add errors
        errors: true,
        // Add details to errors (like resolving log)
        errorDetails: false,
        // Add the hash of the compilation
        hash: false,
        // Add built modules information
        modules: true,
        // Sort the modules by a field
        modulesSort: 'field',
        // Add public path information
        publicPath: false,
        // Add information about the reasons why modules are included
        reasons: false,
        // Add the source code of modules
        source: false,
        // Add timing information
        timings: false,
        // Add webpack version information
        version: false,
        // Add warnings
        warnings: false
      });
      if (err) {
        console.error(err);
        reject(err.message ? err.message : err.toString());
      } else if (jsonStats.errors.length > 0) {
        // console.log(JSON.stringify(jsonStats.modules, null, 4));
        reject(jsonStats.errors.join('\n\n'));
      } else {
        resolve();
      }
    });
  });
}
