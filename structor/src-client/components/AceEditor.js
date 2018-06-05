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

class AceEditor extends Component {

  constructor (props) {
    super(props);
    this.checkEditor = this.checkEditor.bind(this);
    this.getSourceCode = this.getSourceCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  checkEditor (sourceCode) {
    if (!this.editor) {
      //
      let domNode = this.refs.editorElement;
      this.editor = ace.edit(domNode);
      this.editor.getSession().setMode(this.props.mode);
      this.editor.getSession().setTabSize(4);
      if (this.props.isReadOnly) {
        this.editor.setReadOnly(true);
      }
      this.editor.$blockScrolling = Infinity;
      this.editor.getSession().on('change', this.handleChange);
      this.editor.on('blur', this.handleBlur);
      this.editor.on('focus', this.handleFocus);
      this.isFocused = false;
    }
    if (sourceCode) {
      this.editor.getSession().setValue(sourceCode);
    }
    //this.editor.focus();
    //this.editor.navigateFileEnd();
  }

  getSourceCode () {
    if (this.editor) {
      return this.editor.getSession().getValue();
    }
    return null;
  }

  handleChange (e) {
    if (this.isFocused && this.props.onChangeText) {
      this.props.onChangeText(this.editor.getSession().getValue());
    }
  }

  handleFocus () {
    this.isFocused = true;
  }

  handleBlur () {
    this.isFocused = false;
  }

  componentDidMount () {
    this.checkEditor(this.props.sourceCode);
  }

  componentDidUpdate () {
    this.checkEditor(this.props.sourceCode);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.isFocused;
  }

  componentWillUnmount () {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }

  render () {
    return (
      <div ref="editorElement" style={this.props.style}></div>
    );
  }

}

AceEditor.propTypes = {
  mode: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  isReadOnly: PropTypes.bool,
  sourceCode: PropTypes.string
};

AceEditor.defaultProps = {
  sourceCode: '',
  mode: 'ace/mode/javascript',
  onChangeText: null,
  isReadOnly: false
};

export default AceEditor;

