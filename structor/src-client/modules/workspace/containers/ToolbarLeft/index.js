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

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modelSelector } from './selectors.js'
import { containerActions } from './actions.js'
import { Button } from 'react-bootstrap'

const leftSideStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  backgroundColor: 'rgba(53, 179, 238, 0.2)',
  zIndex: 1,
}

const leftSideStyleInner = {
  position: 'relative',
  minWidth: '4em',
  width: '4em',
  padding: '10px 0.5em 0 0.5em',
}

const btnGroupStyle = {
  width: '100%',
  textAlign: 'center',
}

const getAboutText = version => `
<h3 class="text-center">Structor - React UI Builder</h3>
<h5 class="text-center">${version}</h5>
<p class="text-center">Apache License, Version 2.0</p>
<br/>
<hr/>
#### Created by <a href="https://www.linkedin.com/in/apustovalov" target="_blank">Alex Pustovalov</a> 
<i class="fa fa-envelope-o"></i> <a href="mailto:apustovalov@gmail.com">apustovalov@gmail.com</a>\n\n
<i class="fa fa-twitter"></i> <a href="https://twitter.com/alex_pustovalov" target="_blank">@alex_pustovalov</a>
`

class Container extends Component {
  constructor(props) {
    super(props)
    this.handleSaveProject = this.handleSaveProject.bind(this)
    this.handleProxyModal = this.handleProxyModal.bind(this)
    this.handleShowAboutModal = this.handleShowAboutModal.bind(this)
  }

  handleSaveProject(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.saveProject()
  }

  handleProxyModal(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.proxyShowModal()
  }

  handleShowAboutModal(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.showAboutModal(getAboutText(this.props.version))
  }

  render() {
    const { deskPageModel, deskModel } = this.props
    const {
      toggleLibraryPanel,
      togglePageListPanel,
      togglePageTreeview,
      toggleQuickOptions,
    } = this.props
    const { setLivePreviewModeOn, setEditModeOn, reloadPage } = this.props

    return (
      <div style={leftSideStyle}>
        <div style={leftSideStyleInner}>
          <div className="btn-group" style={btnGroupStyle}>
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <span className="fa fa-bars" style={{ fontSize: 32 }} />
            </a>
            <ul className="dropdown-menu" role="menu">
              <li>
                <a href="#" onClick={this.handleSaveProject}>
                  <span className="fa fa-save fa-fw" />
                  &nbsp;Save project
                </a>
              </li>
              <li className="divider" />
              <li>
                <a href="#" onClick={this.handleProxyModal}>
                  <span className="fa fa-gears fa-fw" />
                  &nbsp;Proxy settings
                </a>
              </li>
              <li className="divider" />
              <li>
                <a href="#" onClick={this.handleShowAboutModal}>
                  <span className="fa fa-info fa-fw" />
                  &nbsp;About
                </a>
              </li>
            </ul>
          </div>
          <Button
            bsStyle={deskModel.isLibraryPanelActive ? 'primary' : 'default'}
            style={{ marginTop: '1em', width: '100%' }}
            disabled={!deskPageModel.isEditModeOn}
            onClick={toggleLibraryPanel}
            title="Show the list of available components"
          >
            <span className="fa fa-plus" />
          </Button>
          <Button
            bsStyle={deskModel.isPageListPanelActive ? 'primary' : 'default'}
            style={{ marginTop: '0.25em', width: '100%' }}
            onClick={togglePageListPanel}
            title="Show the list of pages"
          >
            <span className="fa fa-book" />
          </Button>
          <Button
            bsStyle={deskModel.isPageTreeviewActive ? 'primary' : 'default'}
            style={{ marginTop: '1em', width: '100%' }}
            disabled={!deskPageModel.isEditModeOn}
            onClick={togglePageTreeview}
            title="Show components' hierarchy on current page"
          >
            <span className="fa fa-code" />
          </Button>
          <Button
            bsStyle={deskModel.isQuickOptionsActive ? 'primary' : 'default'}
            style={{ marginTop: '0.25em', width: '100%' }}
            disabled={!deskPageModel.isEditModeOn}
            onClick={toggleQuickOptions}
            title="Show component's quick options panel"
          >
            <span className="fa fa-paint-brush" />
          </Button>
          <Button
            bsStyle={deskPageModel.isEditModeOn ? 'primary' : 'default'}
            style={{ marginTop: '1em', width: '100%' }}
            onClick={setEditModeOn}
            title="Switch to edit page mode"
          >
            <span className="fa fa-wrench" />
          </Button>
          <Button
            bsStyle={deskPageModel.isLivePreviewModeOn ? 'primary' : 'default'}
            style={{ marginTop: '0.25em', width: '100%' }}
            onClick={setLivePreviewModeOn}
            title="Switch to view page mode"
          >
            <span className="fa fa-hand-pointer-o" />
          </Button>
          <Button
            bsStyle="default"
            style={{ marginTop: '1em', width: '100%' }}
            onClick={reloadPage}
            title="Reload current page. State will be lost."
          >
            <span className="fa fa-refresh" />
          </Button>
          <div style={{ marginTop: '0.25em', width: '100%', height: '2em' }} />
        </div>
      </div>
    )
  }
}

export default connect(
  modelSelector,
  containerActions
)(Container)
