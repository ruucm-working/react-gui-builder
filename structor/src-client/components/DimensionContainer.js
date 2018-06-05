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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DimensionBox from './DimensionBox.js';

class DimensionBoxContainer extends Component {

  render () {
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
          <DimensionBox type="position">
            <DimensionBox type="margin">
              <DimensionBox type="border">
                <DimensionBox type="padding"/>
              </DimensionBox>
            </DimensionBox>
          </DimensionBox>
        </div>
        <div style={{marginTop: '1em', width: '100%'}}>

        </div>
      </div>
    );
  }
}

export default DimensionBoxContainer;
