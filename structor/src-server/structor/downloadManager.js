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
import { template } from 'lodash';
import { config, commons } from 'structor-commons';
import * as client from '../commons/clientGH.js';

const applicationFiles = [
  'app/components.js',
  'app/reducers.js',
  'app/sagas.js',
  'app/store.js',
  'defaults',
  'desk/model.json',
  'docs',
  'config.js',
  'webpack.app.js',
];

const configTplPath = 'templates/config.js.tpl';
const configFilePath = 'config.js';

export function checkMetaFolderVersion (dirPath, version) {
  const serviceDirPath = path.join(dirPath, config.SERVICE_DIR);
  return commons.isExisting(serviceDirPath)
    .then(() => {
      return commons.readJson(path.join(serviceDirPath, 'version.json'))
        .catch(error => {
          return {};
        });
    })
    .then(data => {
      return data && data.version === version;
    });
}

export function setMetaFolderVersion (dirPath, version) {
  return commons.writeJson(path.join(dirPath, config.SERVICE_DIR, 'version.json'), {version});
}

export function downloadMetaDistr (downloadUrl, destDirPath) {
  return client.download(downloadUrl)
    .then(fileData => {
      let destFilePath = path.join(destDirPath, '__metaDistr.tar.gz').replace(/\\/g, '/');
      let tempDirPath = path.join(destDirPath, '___metaDistr').replace(/\\/g, '/');
      return commons.writeBinaryFile(destFilePath, fileData)
        .then(() => {
          return commons.unpackTarGz(destFilePath, tempDirPath);
        })
        .then(() => {
          return commons.readDirectoryFlat(tempDirPath)
            .then(found => {
              if (found) {
                const {dirs} = found;
                if (dirs && dirs.length === 1) {
                  return dirs[0].path;
                }
              }
              throw Error('Downloaded tarball has different structure. Check the ulr: ' + downloadUrl);
            });
        })
        .then(innerDirPath => {
          return commons.removeFile(destFilePath)
            .then(() => {
              return {innerDirPath, tempDirPath};
            });
        });
    });
}

export function createMetaFolder (srcDirPath, destDirPath, options) {
  const destMetaFolderPath = path.join(destDirPath, config.SERVICE_DIR);
  const srcMetaFolderPath = path.join(srcDirPath, config.SERVICE_DIR);
  return commons.copyFile(srcMetaFolderPath, destMetaFolderPath)
    .then(() => {
      const templatePath = path.join(srcDirPath, configTplPath);
      return commons.readFile(templatePath);
    })
    .then(fileData => {
      return template(fileData)(options);
    })
    .then(newFileData => {
      const destFilePath = path.join(destMetaFolderPath, configFilePath);
      return commons.writeFile(destFilePath, newFileData);
    })
    .then(() => {
      const projectPackageFilePath = path.join(destDirPath, 'package.json');
      return commons.readJson(projectPackageFilePath)
        .then(packageConfig => {
          packageConfig.scripts = packageConfig.scripts || {};
          packageConfig.scripts['structor'] = 'structor';
          return commons.writeJson(projectPackageFilePath, packageConfig);
        });
    });
}

export function updateMetaFolder (srcDirPath, destDirPath) {
  let filesToCopy = [];
  const srcMetaFolderPath = path.join(srcDirPath, config.SERVICE_DIR);
  const destMetaFolderPath = path.join(destDirPath, config.SERVICE_DIR);
  applicationFiles.forEach(filePath => {
    filesToCopy.push({
      srcFilePath: path.join(destMetaFolderPath, filePath),
      destFilePath: path.join(srcMetaFolderPath, filePath),
    });
  });
  return commons.copyFilesNoError(filesToCopy)
    .then(() => {
      return commons.removeFile(destMetaFolderPath);
    })
    .then(() => {
      return commons.copyFile(srcMetaFolderPath, destMetaFolderPath);
    });
}

export function removeFile (filePath) {
  return commons.removeFile(filePath);
}

export function ensureFileStructure (dirPath, options) {
  const srcPath = path.join(dirPath, options.srcPath);
  return commons.ensureDirPath(srcPath)
    .then(() => {
      const srcAssetsPath = path.join(srcPath, 'assets');
      return commons.ensureDirPath(srcAssetsPath);
    });
}
