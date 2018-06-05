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
import { connect } from 'react-redux';
import marked from 'marked';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { Modal, Tabs, Tab, Button } from 'react-bootstrap';
import { AceEditor } from 'components';

class Container extends Component {

  constructor (props) {
    super(props);
    this.state = {
      activeTabKey: 1
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleTextAreaKeyDown = this.handleTextAreaKeyDown.bind(this);
  }

  handleSelectTab (eventKey) {
    if (eventKey) {
      this.setState({
        activeTabKey: eventKey
      });
    }
  }

  handleClose (e) {
    e.stopPropagation();
    e.preventDefault();
    const {hideModal} = this.props;
    hideModal();
    this.setState({
      activeTabKey: 1
    });
  }

  handleSave (e) {
    e.stopPropagation();
    e.preventDefault();
    const {submitChanges} = this.props;
    const {sourceCodeEditor, sourcePropsEditor, sourceTextInput} = this.refs;
    const sourceCode = sourceCodeEditor ? sourceCodeEditor.getSourceCode() : undefined;
    const sourceProps = sourcePropsEditor ? sourcePropsEditor.getSourceCode() : '{}';
    const sourceText = sourceTextInput ? sourceTextInput.value : undefined;
    submitChanges({sourceCode, sourceProps, sourceText});
    this.setState({
      activeTabKey: 1
    });
  }

  handleTextAreaKeyDown (e) {
    if (e.which === 13) {
      this.handleSave(e);
    }
  }

  render () {

    const {componentModel: {sourceCode, sourceFilePath, sourceProps, sourceText, readmeText, show}, hideModal} = this.props;

    const containerStyle = {
      marginTop: '1em',
      width: '100%',
      padding: '1em'
    };
    let tabPanes = [];

    if (sourceText !== undefined) {
      tabPanes.push(
        <Tab key={'text'} eventKey={tabPanes.length + 1} title='Text'>
          <div style={containerStyle}>
            <textarea
              placeholder="Enter text"
              defaultValue={sourceText ? sourceText : ''}
              ref="sourceTextInput"
              style={{width: '100%', height: '400px', margin: '0px'}}
              onKeyDown={this.handleTextAreaKeyDown}
            />
          </div>
        </Tab>
      );
    }
    tabPanes.push(
      <Tab key={'properties'} eventKey={tabPanes.length + 1} title='Properties'>
        <div style={containerStyle}>
          <AceEditor
            ref='sourcePropsEditor'
            sourceName='componentPropsScript'
            style={{width: '100%', height: '400px'}}
            sourceCode={sourceProps}
          />
        </div>
      </Tab>
    );
    if (!!sourceCode) {
      tabPanes.push(
        <Tab key={'component'} eventKey={tabPanes.length + 1} title='The Source Code'>
          <div style={containerStyle}>
            <p style={{wordBreak: "break-all"}}>
              <strong>File:&nbsp;</strong>
              <span>{sourceFilePath}</span>
            </p>
            <AceEditor
              ref='sourceCodeEditor'
              sourceName='componentSource'
              mode='ace/mode/jsx'
              style={{width: '100%', height: '400px'}}
              sourceCode={sourceCode}
            />

          </div>
        </Tab>
      );
    }
    if (!!readmeText) {
      tabPanes.push(
        <Tab key={'readMe'} eventKey={tabPanes.length + 1} title='Read Me'>
          <div style={{height: '400px', marginTop: '1em', width: '100%', padding: '1em', overflow: 'auto'}}>
            <div dangerouslySetInnerHTML={{__html: marked(readmeText)}}>
            </div>
          </div>
        </Tab>
      );
    }

    return (
      <Modal
        show={show}
        onHide={() => {hideModal();}}
        dialogClassName='umy-modal-overlay'
        backdrop={true}
        keyboard={true}
        bsSize='large'
        ref='dialog'
        animation={true}
      >
        <Modal.Body>
          <Tabs
            id="componentOptionsModal"
            onSelect={this.handleSelectTab}
            activeKey={this.state.activeTabKey}
          >
            {tabPanes}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button
            onClick={this.handleSave}
            bsStyle="primary"
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);