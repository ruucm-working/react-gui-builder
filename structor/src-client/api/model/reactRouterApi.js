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

const reg = /(\/.+?)(?:#|\?|$)/;

export function getAvailableRoute (existingRoutes, checkPathname) {
  let candidateRootKey = undefined;
  if (existingRoutes && existingRoutes.length > 0) {
    if (checkPathname === '/' || checkPathname === '/structor-deskpage' || checkPathname === '/structor-deskpage/') {
      candidateRootKey = existingRoutes[0];
    } else {
      const match = reg.exec(checkPathname);
      if (match && match.length > 0) {
        candidateRootKey = existingRoutes.find(i => match[1] === i);
      }
    }
  }
  if (!candidateRootKey) {
    console.error('Path name ' + checkPathname + ' was not found in project model.');
  }
  return candidateRootKey;
}
