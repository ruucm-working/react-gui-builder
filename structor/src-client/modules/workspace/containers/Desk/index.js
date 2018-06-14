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
import {
  containerActions,
  MAX_BOTTOM_PANEL_HEIGHT,
  MIN_BOTTOM_PANEL_HEIGHT,
} from './actions.js'
import { coockiesApi } from 'api'

import DeskPage from 'modules/workspace/containers/DeskPage'
import ToolbarLeft from 'modules/workspace/containers/ToolbarLeft'
import ToolbarTop from 'modules/workspace/containers/ToolbarTop'
import ToolbarMiddle from 'modules/workspace/containers/ToolbarMiddle'
import PageTreeViewPanel from 'modules/workspace/containers/PageTreeViewPanel'
import ToolbarSelection from 'modules/workspace/containers/ToolbarSelection'
import LibraryPanel from 'modules/workspace/containers/LibraryPanel'
import PageListPanel from 'modules/workspace/containers/PageListPanel'
import ComponentOptionsPanel from 'modules/workspace/containers/ComponentOptionsPanel'
import PageTreeViewToolbar from 'modules/workspace/containers/PageTreeViewToolbar'
import ComponentReadmePanel from 'modules/workspace/containers/ComponentReadmePanel'

class Container extends Component {
  constructor(props) {
    super(props)
    this.handleTogglePageTreeView = this.handleTogglePageTreeView.bind(this)
    this.handleToggleInsertionModePageTreeView = this.handleToggleInsertionModePageTreeView.bind(
      this
    )
    this.handleToggleBottomRightPanel = this.handleToggleBottomRightPanel.bind(
      this
    )
    this.handleButtonMouseDown = this.handleButtonMouseDown.bind(this)
    this.handleButtonMouseUp = this.handleButtonMouseUp.bind(this)
    this.handleButtonMouseMove = this.handleButtonMouseMove.bind(this)
    this.state = {
      treeViewHeight: this.props.componentModel.bottomPanelHeight,
      isMouseDown: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { componentModel } = nextProps
    if (componentModel !== this.props.componentModel) {
      this.setState({ treeViewHeight: componentModel.bottomPanelHeight })
      coockiesApi.saveDeskSettings({ layout: componentModel })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isMouseDown, treeViewHeight } = this.state
    if (isMouseDown === false && prevState.isMouseDown === true) {
      this.props.setBottomPanelHeight(treeViewHeight)
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleButtonMouseMove)
    document.addEventListener('mouseup', this.handleButtonMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleButtonMouseMove)
    document.removeEventListener('mouseup', this.handleButtonMouseUp)
  }

  handleTogglePageTreeView(e) {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    this.props.togglePageTreeview()
  }

  handleToggleInsertionModePageTreeView(e) {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    this.props.toggleBottomPanelInsertionMode()
  }

  handleToggleBottomRightPanel(e) {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    this.props.toggleBottomRightPanel()
  }

  handleButtonMouseDown(e) {
    this.setState({ isMouseDown: true, clientY: e.clientY })
  }

  handleButtonMouseUp(e) {
    const { isMouseDown } = this.state
    if (isMouseDown) {
      this.setState({ isMouseDown: false })
    }
  }

  handleButtonMouseMove(e) {
    const { isMouseDown } = this.state
    if (isMouseDown) {
      const { clientY: prevY, treeViewHeight } = this.state
      const { clientX, clientY } = e
      const newHeight = treeViewHeight - (clientY - prevY)
      if (
        newHeight <= MAX_BOTTOM_PANEL_HEIGHT &&
        newHeight >= MIN_BOTTOM_PANEL_HEIGHT
      ) {
        this.setState({
          treeViewHeight: treeViewHeight - (clientY - prevY),
          clientX,
          clientY,
        })
      }
    }
  }

  render() {
    const { componentModel, deskPageModel } = this.props
    const { treeViewHeight, isMouseDown } = this.state
    let leftPanelWidth = 0
    let leftPanelInner = null
    if (
      componentModel.isLibraryPanelActive &&
      !deskPageModel.isLivePreviewModeOn
    ) {
      leftPanelWidth = 250
      leftPanelInner = <LibraryPanel />
    }
    if (componentModel.isPageListPanelActive) {
      leftPanelWidth = 250
      leftPanelInner = <PageListPanel />
    }

    let bottomPanelHeight = 0
    let bottomLeftPanelInner = null
    let bottomRightPanelInner = null
    if (
      componentModel.isPageTreeviewActive &&
      !deskPageModel.isLivePreviewModeOn
    ) {
      bottomPanelHeight = treeViewHeight
      bottomLeftPanelInner = (
        <PageTreeViewPanel
          isInsertionModeOn={componentModel.bottomPanelInsertionMode}
        />
      )
      if (componentModel.bottomRightPanelActive) {
        bottomRightPanelInner = <ComponentReadmePanel />
      }
    }

    let rightPanelWidth = 0
    let rightPanelInner = null
    if (
      componentModel.isQuickOptionsActive &&
      !deskPageModel.isLivePreviewModeOn
    ) {
      rightPanelWidth = 250
      rightPanelInner = <ComponentOptionsPanel />
    }

    let leftPanelStyle = {
      position: 'absolute',
      top: '0px',
      left: '4em',
      bottom: '0px',
      width: leftPanelWidth + 'px',
    }

    let bottomWrapperPanelStyle = {
      position: 'absolute',
      left: '0px',
      right: '0px',
      bottom: '0px',
      height: bottomPanelHeight + 'px',
    }

    let bottomLeftPanelStyle = {
      position: 'absolute',
      left: '0px',
      width: componentModel.bottomRightPanelActive ? '50%' : '100%',
      bottom: '0px',
      top: '0px',
      padding: '0 0 5px 0',
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
    }

    let bottomRightPanelStyle = {
      position: 'absolute',
      width: '50%',
      top: '0px',
      right: '0px',
      bottom: '0px',
      padding: '0 0 5px 0',
    }

    let breadcrumbsComponent = null
    let selectionToolbarComponent = null
    let topPanelHeight = 0

    if (!deskPageModel.isLivePreviewModeOn) {
      let breadcrumbsTopStyle = {
        position: 'absolute',
        top: '0px',
        paddingTop: '10px',
        left: 'calc(4em + ' + leftPanelWidth + 'px)',
        right: '5px',
        height: '3em',
        borderLeft: '1px solid #dbdbdb',
        zIndex: 1,
        backgroundColor: 'rgba(92, 184, 92, 0.3)',
      }
      breadcrumbsComponent = <ToolbarTop style={breadcrumbsTopStyle} />

      let selectionToolbarStyle = {
        position: 'absolute',
        top: '3em',
        left: 'calc(4em + ' + leftPanelWidth + 'px)',
        right: '5px',
        paddingTop: '5px',
        height: '3em',
        borderLeft: '1px solid #dbdbdb',
        zIndex: 1,
        backgroundColor: 'rgba(92, 184, 92, 0.3)',
      }
      selectionToolbarComponent = (
        <ToolbarSelection style={selectionToolbarStyle} />
      )

      topPanelHeight = 6
    } else {
      topPanelHeight = 0.3
    }

    let rightPanelStyle = {
      position: 'absolute',
      top: topPanelHeight + 'em',
      right: '0px',
      bottom: '0px',
      width: rightPanelWidth + 'px',
      // paddingLeft: '5px',
      overflow: 'hidden',
      padding: '0 5px 5px 0',
    }
    let bodyContainerStyle
    if (!deskPageModel.isLivePreviewModeOn) {
      bodyContainerStyle = {
        position: 'absolute',
        top: topPanelHeight + 'em',
        left: 'calc(4em + ' + leftPanelWidth + 'px)',
        //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
        // bottom: bottomPanelHeight + 'px',
        bottom: '0px',
        overflow: 'hidden',
        // right: '5px'
        right: 'calc(5px + ' + rightPanelWidth + 'px)',
      }
    } else {
      bodyContainerStyle = {
        position: 'absolute',
        // top: topPanelHeight + 'em',
        top: '0px',
        // left: 'calc(4em + ' + leftPanelWidth + 'px)',
        //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
        // bottom: bottomPanelHeight + 'px',
        bottom: '0px',
        overflow: 'hidden',
        // right: '5px'
        // right: 'calc(5px + ' + rightPanelWidth + 'px)',
        width: '100%',
        zIndex: 0,
      }
    }

    let bodyStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: 'calc(' + bottomPanelHeight + 'px + 5px)',
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      border: '1px solid #000000',
    }

    let iframeWidth = componentModel.iframeWidth
    //let marginRight = '0';
    if (iframeWidth !== '100%') {
      iframeWidth = parseInt(iframeWidth) + 'px'
      //marginRight = 'calc((100% - ' + iframeWidth + ')/2)';
    }
    let iframeStyle = {
      // "height" : "calc(100% - 5px)",
      height: '100%',
      width: iframeWidth,
      minWidth: '320px',
      margin: '0px',
      //"marginRight": marginRight,
      padding: '0px',
      border: '0',
    }

    let pageFrame = <DeskPage frameBorder="0" style={iframeStyle} />

    const leftBar = <ToolbarLeft />

    return (
      <div style={{ width: '100%', height: '100%' }}>
        {leftBar}
        {leftPanelWidth > 0 && (
          <div style={leftPanelStyle}>{leftPanelInner}</div>
        )}
        {breadcrumbsComponent}
        {selectionToolbarComponent}
        <div style={bodyContainerStyle}>
          <div style={bodyStyle}>{pageFrame}</div>
          {isMouseDown && (
            <div style={Object.assign({}, bodyStyle, { zIndex: 100 })} />
          )}
          {bottomPanelHeight > 0 && (
            <div style={bottomWrapperPanelStyle}>
              <button
                className="btn-default btn-xs"
                style={{
                  padding: '0.2em',
                  position: 'absolute',
                  top: '-1.2em',
                  left: '2px',
                  width: '2em',
                  height: '2em',
                  borderRadius: '50%',
                  zIndex: 1030,
                }}
                onClick={this.handleTogglePageTreeView}
                title="Close tree view panel"
              >
                <span className="fa fa-times fa-fw" />
              </button>
              <button
                className={
                  'btn-xs' +
                  (componentModel.bottomPanelInsertionMode
                    ? ' btn-primary'
                    : ' btn-default')
                }
                style={{
                  padding: '0.2em',
                  position: 'absolute',
                  top: '-1.2em',
                  left: '2.2em',
                  width: '2em',
                  height: '2em',
                  borderRadius: '50%',
                  zIndex: 1030,
                }}
                onClick={this.handleToggleInsertionModePageTreeView}
                title="Toggle placeholders in tree view"
              >
                <span className="fa fa-indent fa-fw" />
              </button>
              <button
                className={
                  'btn-xs' +
                  (componentModel.bottomRightPanelActive
                    ? ' btn-primary'
                    : ' btn-default')
                }
                style={{
                  padding: '0.2em',
                  position: 'absolute',
                  top: '-1.2em',
                  left: '4.2em',
                  width: '2em',
                  height: '2em',
                  borderRadius: '50%',
                  zIndex: 1030,
                }}
                onClick={this.handleToggleBottomRightPanel}
                title="Toggle component readme"
              >
                <span className="fa fa-file-text-o fa-fw" />
              </button>
              <button
                style={{
                  padding: '0.1em',
                  position: 'absolute',
                  top: '-1em',
                  left: 'calc(50% - 1.5em)',
                  width: '3em',
                  height: '1.5em',
                  cursor: 'ns-resize',
                  border: '1px solid #dcdcdc',
                  borderRadius: '3px',
                  backgroundColor: '#fff',
                  zIndex: 1030,
                }}
                onMouseDown={this.handleButtonMouseDown}
                title="Resize tree view panel"
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '.4em',
                    left: '.5em',
                    height: '0',
                    right: '.5em',
                    borderTop: '1px solid #dcdcdc',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '.8em',
                    left: '.5em',
                    height: '0',
                    right: '.5em',
                    borderTop: '1px solid #dcdcdc',
                  }}
                />
              </button>
              <div style={bottomLeftPanelStyle}>
                <PageTreeViewToolbar
                  style={{
                    position: 'absolute',
                    top: '3em',
                    left: '2px',
                    zIndex: 1030,
                  }}
                />
                {bottomLeftPanelInner}
              </div>
              {bottomRightPanelInner && (
                <div style={bottomRightPanelStyle}>{bottomRightPanelInner}</div>
              )}
            </div>
          )}
        </div>
        {rightPanelWidth > 0 && (
          <div style={rightPanelStyle}>{rightPanelInner}</div>
        )}
      </div>
    )
  }
}

export default connect(
  modelSelector,
  containerActions
)(Container)
