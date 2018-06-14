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

import { forOwn, difference } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modelSelector } from './selectors.js'
import { containerActions } from './actions.js'

import { graphApi } from 'api/index'
import {
  PageTreeViewItem,
  PageTreeViewItemText,
  PageTreeViewPlaceholder,
  PlaceholderCircle,
  MouseOverOverlay,
} from 'components'
import MouseMenuOverlay from '../../../../components/MouseMenuOverlay'

const scrollToSelected = function($frameWindow, key) {
  setTimeout(
    (function(_frameWindow) {
      return function() {
        let $selected = _frameWindow.find('#' + key)
        if ($selected && $selected.length > 0) {
          const diff =
            $selected.offset().top +
            _frameWindow.scrollTop() -
            _frameWindow.offset().top
          const margin = parseInt(_frameWindow.css('height')) / 5
          //_frameWindow[0].scrollTop = (diff - margin);
          //console.log("Scroll to " + (diff - margin));
          _frameWindow.animate({ scrollTop: diff - margin }, 300)
        }
        $selected = null
      }
    })($frameWindow),
    0
  )
}

const panelStyle = {
  padding: '2em 1em 1em 2em',
  height: '100%',
  overflow: 'auto',
  border: '1px solid #DBDBDB',
  borderRadius: '3px',
  position: 'relative',
}

class Container extends Component {
  constructor(props) {
    super(props)
    this.shouldScroll = true
    this.scrollToSelected = this.scrollToSelected.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.handleShowMouseMenu = this.handleShowMouseMenu.bind(this)
    this.handleHideMouseMenu = this.handleHideMouseMenu.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMenuClick = this.handleMouseMenuClick.bind(this)
    this.handleSetHighlightSelectedKey = this.handleSetHighlightSelectedKey.bind(
      this
    )
    this.handleRemoveHighlightSelectedKey = this.handleRemoveHighlightSelectedKey.bind(
      this
    )
    const { deskPageModel } = this.props
    const pageGraph = deskPageModel
      ? graphApi.getWrappedModelByPagePath(deskPageModel.currentPagePath)
      : {}
    this.state = {
      pageGraph,
      showMouseMenu: false,
    }
  }

  componentDidMount() {
    this.$frameWindow = $(this.panelElement)
    this.scrollToSelected()
  }

  componentDidUpdate() {
    this.scrollToSelected()
  }

  componentWillUnmount() {
    this.$frameWindow = undefined
  }

  componentWillReceiveProps(nextProps) {
    const { deskPageModel } = this.props
    const { deskPageModel: newDeskPageModel } = nextProps
    if (
      newDeskPageModel.reloadPageCounter !== deskPageModel.reloadPageCounter ||
      newDeskPageModel.currentPagePath !== deskPageModel.currentPagePath ||
      newDeskPageModel.markedUpdateCounter !==
        deskPageModel.markedUpdateCounter ||
      newDeskPageModel.modelUpdateCounter !== deskPageModel.modelUpdateCounter
    ) {
      this.setState({
        pageGraph: graphApi.getWrappedModelByPagePath(
          newDeskPageModel.currentPagePath
        ),
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { deskPageModel, currentSelectedKeys, isInsertionModeOn } = this.props
    const { showMouseMenu, pointX, pointY } = this.state
    const {
      deskPageModel: newDeskPageModel,
      currentSelectedKeys: newSelectedKeys,
      isInsertionModeOn: nextInsertionModeOn,
    } = nextProps

    if (!this.shouldScroll) {
      this.shouldScroll = newSelectedKeys !== currentSelectedKeys
    }
    return (
      newDeskPageModel.reloadPageCounter !== deskPageModel.reloadPageCounter ||
      newDeskPageModel.currentPagePath !== deskPageModel.currentPagePath ||
      newDeskPageModel.markedUpdateCounter !==
        deskPageModel.markedUpdateCounter ||
      newDeskPageModel.modelUpdateCounter !==
        deskPageModel.modelUpdateCounter ||
      isInsertionModeOn !== nextInsertionModeOn ||
      showMouseMenu !== nextState.showMouseMenu ||
      pointX !== nextState.pointX ||
      pointY !== nextState.pointY
    )
  }

  scrollToSelected() {
    if (this.shouldScroll) {
      const selectedKeys = this.props.currentSelectedKeys
      if (selectedKeys && selectedKeys.length > 0) {
        scrollToSelected(
          this.$frameWindow,
          selectedKeys[selectedKeys.length - 1]
        )
      }
      this.shouldScroll = false
    }
  }

  handleContextMenu(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  handleMouseDown(e) {
    this.handleHideMouseMenu()
  }

  handlePlaceholderClick = type => nodeKey => {
    const { handleBefore, handleAfter, handleReplace } = this.props
    if (type === 'pasteAfter') {
      handleAfter(nodeKey)
    } else if (type === 'pasteBefore') {
      handleBefore(nodeKey)
    } else if (type === 'pasteReplace') {
      handleReplace(nodeKey)
    }
  }

  handleMouseMenuClick(type, itemKey) {
    const { currentSelectedKeys } = this.props
    const {
      handleBefore,
      handleAfter,
      handleReplace,
      handleFirst,
      setForCuttingKeys,
      setForCopyingKeys,
      deleteSelected,
    } = this.props
    if (type === 'after') {
      handleAfter(itemKey)
    } else if (type === 'before') {
      handleBefore(itemKey)
    } else if (type === 'replace') {
      handleReplace(itemKey)
    } else if (type === 'first') {
      handleFirst(itemKey)
    } else if (type === 'cut') {
      setForCuttingKeys(currentSelectedKeys)
    } else if (type === 'copy') {
      setForCopyingKeys(currentSelectedKeys)
    } else if (type === 'delete') {
      deleteSelected()
    }
    this.handleHideMouseMenu()
  }

  handleSetHighlightSelectedKey(e) {
    const key = e.currentTarget.dataset.key
    const { setHighlightSelectedKey } = this.props
    setHighlightSelectedKey(key, true)
  }

  handleRemoveHighlightSelectedKey(e) {
    const key = e.currentTarget.dataset.key
    const { setHighlightSelectedKey } = this.props
    setHighlightSelectedKey(key, false)
  }

  handleChangeText(text, nodeKey) {
    this.props.changeText(text, nodeKey)
  }

  handleShowMouseMenu(e, itemKey) {
    this.setState({
      showMouseMenu: true,
      pointX: e.pageX,
      pointY: e.pageY,
      itemKey,
    })
  }

  handleHideMouseMenu() {
    this.setState({ showMouseMenu: false })
  }

  buildNode = graphNode => {
    let inner = []
    const modelNode = graphNode.modelNode
    const { setSelectedKey, isInsertionModeOn } = this.props

    let innerProps = []
    if (graphNode.props) {
      forOwn(graphNode.props, (prop, propName) => {
        innerProps.push(this.buildNode(prop))
      })
    }
    let children = []
    if (graphNode.children && graphNode.children.length > 0) {
      graphNode.children.forEach(node => {
        children.push(this.buildNode(node))
        if (isInsertionModeOn) {
          children.push(
            <PageTreeViewPlaceholder
              key={'treeItemPlaceholder' + node.key}
              itemKey={node.key}
              title="Place component after selected"
              onClick={this.handlePlaceholderClick('pasteAfter')}
              onMouseEnter={this.handleSetHighlightSelectedKey}
              onMouseLeave={this.handleRemoveHighlightSelectedKey}
            />
          )
        }
      })
    } else if (modelNode.text !== undefined) {
      inner.push(
        <PageTreeViewItemText
          itemKey={graphNode.key}
          key={'text' + graphNode.key}
          onChangeText={this.handleChangeText}
          textValue={modelNode.text}
        />
      )
    }

    if (innerProps.length > 0 || children.length > 0) {
      inner.push(
        <ul
          id={graphNode.key}
          key={'list' + graphNode.key}
          style={{ display: 'block' }}
          className={
            graphNode.selected
              ? 'umy-treeview-list-selected'
              : 'umy-treeview-list'
          }
        >
          {innerProps}
          {graphNode.children &&
            graphNode.children.length > 0 &&
            isInsertionModeOn && (
              <PageTreeViewPlaceholder
                key={'firstItemPlaceholder' + graphNode.children[0].key}
                itemKey={graphNode.children[0].key}
                title="Place component before selected"
                onClick={this.handlePlaceholderClick('pasteBefore')}
                onMouseEnter={this.handleSetHighlightSelectedKey}
                onMouseLeave={this.handleRemoveHighlightSelectedKey}
              />
            )}
          {children}
        </ul>
      )
    }
    let replacePlaceholder = null
    if (isInsertionModeOn) {
      replacePlaceholder = (
        <PlaceholderCircle
          key={'replacePlaceholder' + graphNode.key}
          itemKey={graphNode.key}
          onClick={this.handlePlaceholderClick('pasteReplace')}
          iconClassName="fa fa-refresh"
          title="Replace selected component"
          onMouseEnter={this.handleSetHighlightSelectedKey}
          onMouseLeave={this.handleRemoveHighlightSelectedKey}
        />
      )
    }
    return (
      <PageTreeViewItem
        key={'treeItem' + graphNode.key}
        itemKey={graphNode.key}
        isSelected={graphNode.selected}
        isForCutting={graphNode.isForCutting}
        isForCopying={graphNode.isForCopying}
        type={modelNode.type}
        namespace={modelNode.namespace}
        modelProps={modelNode.props}
        onSelect={setSelectedKey}
        onMouseEnter={this.handleSetHighlightSelectedKey}
        onMouseLeave={this.handleRemoveHighlightSelectedKey}
        isPadding={isInsertionModeOn}
        beforeNamePlaceholder={replacePlaceholder}
        onShowMouseMenu={this.handleShowMouseMenu}
        onHideMouseMenu={this.handleHideMouseMenu}
      >
        {inner}
      </PageTreeViewItem>
    )
  }

  render() {
    const { pageGraph, showMouseMenu, pointX, pointY, itemKey } = this.state
    const { isInsertionModeOn } = this.props

    let listItems = []
    if (pageGraph) {
      pageGraph.children.forEach((child, index) => {
        listItems.push(this.buildNode(child))
        if (isInsertionModeOn) {
          listItems.push(
            <PageTreeViewPlaceholder
              key={'treeItemPlaceholder' + child.key}
              isTopLevelPlace={true}
              itemKey={child.key}
              title="Place component after selected"
              onClick={this.handlePlaceholderClick('pasteAfter')}
              onMouseEnter={this.handleSetHighlightSelectedKey}
              onMouseLeave={this.handleRemoveHighlightSelectedKey}
            />
          )
        }
      })
    }

    return (
      <div
        ref={me => (this.panelElement = me)}
        style={panelStyle}
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleMouseDown}
      >
        <div>
          <ul className="umy-treeview-list" style={{ border: 0 }}>
            {pageGraph.children.length > 0 &&
              isInsertionModeOn && (
                <PageTreeViewPlaceholder
                  key={'firstItemPlaceholder'}
                  isTopLevelPlace={true}
                  itemKey={pageGraph.children[0].key}
                  title="Place component before selected"
                  onClick={this.handlePlaceholderClick('pasteBefore')}
                  onMouseEnter={this.handleSetHighlightSelectedKey}
                  onMouseLeave={this.handleRemoveHighlightSelectedKey}
                />
              )}
            {listItems}
          </ul>
        </div>
        <MouseMenuOverlay
          showMenu={showMouseMenu}
          pointX={pointX}
          pointY={pointY}
          panel={this.panelElement}
          onMenuItemClick={this.handleMouseMenuClick}
          itemKey={itemKey}
        />
      </div>
    )
  }
}

export default connect(
  modelSelector,
  containerActions
)(Container)
