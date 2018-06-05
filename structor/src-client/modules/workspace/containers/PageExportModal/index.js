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

import marked from 'marked';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { ListGroup, ListGroupItem, Modal, Button } from 'react-bootstrap';

const listContainerStyle = {
  maxHeight: '200px',
  overflow: 'auto',
  borderBottom: '1px solid #f5f5f5'
};

const labelContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const labelStyle = {
  margin: 0,
  whiteSpace: 'wrap',
  wordBreak: 'break-all'
};

const checkBoxLabelStyle = {
  width: '1.5em',
  minWidth: '1.5em',
  flexGrow: 0,
};

let checkBoxStyle = {
  margin: 0,
};

const makeTitle = (componentName) => {
  let titleComponentName = componentName;
  if (titleComponentName && titleComponentName.length > 30) {
    titleComponentName = titleComponentName.substr(0, 30) + '...';
  }
  return titleComponentName;
};

const warningExportPages = `
The source code of the selected pages will be saved into the directory:\n\n
\`<APP_SRC_DIR>/routes\`\n\n
**Warning:** The content of this directory will be rewritten
`;

const warnigExportApplication = `
The source code of the selected pages will be saved into the directory:\n\n
\`<APP_SRC_DIR>/routes\`\n\n
The following files will be created in \`<APP_SRC_DIR>\`\n\n
* **store.js** - Redux store\n
* **reducers.js** - Redux global reducer combination\n
* **sagas.js** - Sagas combination\n
* **index.js** - Application main entry file\n\n
**Note:** The content of the directory and files will be rewritten\n
`;

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
  }

  handleCancel (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {hidePageExportModal} = this.props;
    hidePageExportModal();
  }

  handleAccept (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {submitPageExport, pages, selectedRoutes, exportMode} = this.props;
    submitPageExport(pages, selectedRoutes, exportMode);
  }

  handleSelectPage (e) {
    e.stopPropagation();
    const pagePath = e.currentTarget.dataset.path;
    this.props.toggleRouteSelection(pagePath);
  }

  render () {
    const {showPageExportDialog, pages, selectedRoutes, exportMode} = this.props;
    const message = exportMode === 'pages' ? warningExportPages : warnigExportApplication;
    let items = [];
    if (pages && pages.length > 0) {
      pages.forEach((item, index) => {
        items.push(
          <ListGroupItem
            href="#"
            key={'' + item.key + index}
            style={{position: 'relative'}}
            data-path={item.pagePath}
            onClick={this.handleSelectPage}
          >
            <div style={labelContainerStyle}>
              <div style={checkBoxLabelStyle}>
                <input
                  type="checkbox"
                  style={checkBoxStyle}
                  data-path={item.pagePath}
                  checked={!!selectedRoutes[item.pagePath]}
                  onClick={this.handleSelectPage}
                />
              </div>
              <div>
                <span style={labelStyle}>{item.pagePath}</span>
              </div>
            </div>
          </ListGroupItem>
        );
      });
    }

    return (
      <Modal
        show={showPageExportDialog}
        onHide={this.handleCancel}
        dialogClassName="umy-modal-overlay umy-modal-middlesize"
        backdrop={true}
        keyboard={true}
        bsSize="large"
        ref="dialog"
        animation={true}
      >
        <Modal.Header
          closeButton={false}
          aria-labelledby='contained-modal-title'
        >
          <Modal.Title id='contained-modal-title'>Select Pages for Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={listContainerStyle}>
            <ListGroup>
              {items}
            </ListGroup>
          </div>
          <div style={{padding: '1em'}}>
            {message &&
            <div dangerouslySetInnerHTML={{__html: marked(message)}}/>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button onClick={this.handleAccept} bsStyle="primary">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(modelSelector, containerActions)(Container);

