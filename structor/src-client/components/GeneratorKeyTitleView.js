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

class GeneratorKeyTitleView extends Component {

  constructor (props, content) {
    super(props, content);
  }

  render () {
    const {generatorKey} = this.props;
    if (generatorKey && generatorKey.length > 0 && generatorKey.indexOf('.') > 0) {
      let parts = generatorKey.split('.');
      let partsItems = [];
      for (let i = 0; i < parts.length; i++) {
        if (i != parts.length - 1) {
          partsItems.push(
            <span key={'part' + i}>{parts[i]}</span>
          );
          partsItems.push(
            <span key={'dot' + i} className="text-muted" style={{margin: '0 0.3em'}}>{'/'}</span>
          );
        } else {
          partsItems.push(
            <span key={'name' + i} className="text-danger">{parts[i]}</span>
          );
        }
      }
      return <span style={this.props.style}>{partsItems}</span>;
    } else {
      return <span style={this.props.style}>{generatorKey}</span>;
    }
  }
}
GeneratorKeyTitleView.defaultProps = {
  generatorKey: ''
};
GeneratorKeyTitleView.propTypes = {
  generatorKey: PropTypes.string
};

export default GeneratorKeyTitleView;
