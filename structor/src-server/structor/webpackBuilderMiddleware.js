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

export default function webpackBuilderMiddleware (compiler, opts) {

  compiler.plugin('done', stats => {
    if (opts.callback) {
      stats = stats.toJson({
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
        modules: false,
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
      opts.callback({
        status: 'done',
        time: stats.time,
        hash: stats.hash,
        warnings: stats.warnings,
        errors: stats.errors
      });
    }
  });

  compiler.plugin('compilation', (c, params) => {
    if (opts.callback) {
      opts.callback({status: 'start'});
    }
  });

  return function (req, res, next) {
    return next();
  };

};
