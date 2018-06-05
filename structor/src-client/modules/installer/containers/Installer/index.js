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

import { debounce } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import imgSrc from 'assets/app/css/img/umylogo-white.svg';

import { ButtonGroup, Button } from 'react-bootstrap';
import { NamespaceCard } from 'components';

const containerStyle = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  overflow: 'auto',
  display: 'flex',
};
const toolbarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
};
const toolbarLabelStyle = {
  margin: '0 1em'
};
const logoSectionStyle = {
  width: '10em',
  padding: '0 2em',
};
const closeSectionStyle = {
  width: '10em',
  padding: '0 2em',
};
const centerSectionStyle = {
  display: 'flex',
  flexGrow: 2,
  justifyContent: 'center'
};
const toolbarSectionStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  margin: '2em 0 2em 0',
};
const galleryStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexFlow: 'wrap',
  justifyContent: 'center',
  alignContent: 'stretch',
};
const namespaceCardStyle = {
  margin: '1em 1em 0 1em',
  // width: '45%',
  flexGrow: 0,
};
const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleBrowseFiles = this.handleBrowseFiles.bind(this);
    this.handleInstall = this.handleInstall.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.state = {
      selectedFile: null,
      searchText: this.props.searchText,
    };
  }

  componentDidMount () {
    this.containerElement.scrollTop = 0;
    this.delayedChangeSearchValue = debounce(text => {
      if (this.props.search) {
        this.props.search(text);
      }
    }, 500);
    this.props.getMarketIndexList();
  }

  handleClose (e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.hideInstaller();
  }

  handleBrowseFiles (e) {
    this.props.showDirPathModal();
  }

  handleInstall (url) {
    this.props.installFromUrl(url);
  }

  handleShowMore (e) {
    e.stopPropagation();
    e.preventDefault();
    const panelOffset = $(this.showMoreButton).offset();
    this.props.showMore();
    const $body = $(this.containerElement);
    let diff = (panelOffset.top + $body.scrollTop()) - $body.offset().top;
    let margin = 130;
    $body.animate(
      {scrollTop: (diff - margin)},
      300
    );
    setTimeout(() => {
      this.setState({isExpanded: !isExpanded});
    }, 300);
  }

  handleChangeSearch (e) {
    this.delayedChangeSearchValue(this.inputSearchElement.value);
    this.setState({searchText: this.inputSearchElement.value});
  }

  handleClearSearch (e) {
    this.props.clearSearch();
    this.setState({searchText: ''});
  }

  render () {
    const {filteredIndexList, limit} = this.props;
    const {searchText} = this.state;
    let namespacesCards = [];
    for (let i = 0; i < filteredIndexList.length; i++) {
      if (i >= limit) {
        break;
      }
      const {gitHubRepo, gitHubOwner} = filteredIndexList[i];
      namespacesCards.push(
        <NamespaceCard
          key={gitHubRepo + gitHubOwner + i}
          style={namespaceCardStyle}
          repoData={filteredIndexList[i]}
          onInstallClick={this.handleInstall}
        />
      );
    }
    return (
      <div
        ref={me => this.containerElement = me}
        id="containerElement"
        style={containerStyle}
      >
        <div style={{width: '100%', position: 'fixed', zIndex: '100', padding: '0 2em'}}>
          <div style={{backgroundColor: '#f5f5f5', borderBottom: '1px solid #ffffff'}}>
            <div style={toolbarContainerStyle}>
              <div style={logoSectionStyle}>
              </div>
              <div style={centerSectionStyle}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{flexGrow: 1}}>
                    <h2 style={{margin: '0px'}}>Structor</h2>
                  </div>
                  <div style={{width: '4em', margin: '0 .5em'}}>
                    <img
                      style={{width: '100%'}}
                      src={imgSrc}
                      alt=""
                    />
                  </div>
                  <div style={{flexGrow: 1}}>
                    <h2 style={{margin: '0px'}}>Market</h2>
                  </div>
                </div>
              </div>
              <div style={closeSectionStyle}>
                <div
                  style={{cursor: 'pointer'}}
                  onClick={this.handleClose}
                >
                  <p
                    className="text-center"
                    style={{margin: '0px', fontSize: '15px', fontWeight: 200}}
                  >
                    <i className="fa fa-times"/>
                  </p>
                  <p
                    className="text-center"
                    style={{margin: '0px'}}
                  >
                    <small>Close</small>
                  </p>
                </div>
              </div>
            </div>
            <div style={toolbarSectionStyle}>
              <div style={toolbarStyle}>
                <div style={{marginRight: '0.5em'}}>
                  {filteredIndexList.length} items found
                </div>
                <div style={{marginRight: '0.5em', width: '300px'}}>
                  <div className="input-group input-group-sm">
                    <input
                      ref={me => this.inputSearchElement = me}
                      type="text"
                      className="form-control"
                      placeholder="Filter by words in description..."
                      value={searchText || ''}
                      onChange={this.handleChangeSearch}
                    />
                    <span className="input-group-btn">
                                            <button
                                              className="btn btn-default"
                                              type="button"
                                              title="Clear filter text"
                                              onClick={this.handleClearSearch}
                                            >
                                                <span className="fa fa-times"/>
                                            </button>
                                        </span>
                  </div>
                </div>
                <div style={{marginRight: '0.5em'}}>
                  <button
                    className="btn btn-default btn-sm"
                    onClick={this.handleBrowseFiles}
                  >
                    <i className="fa fa-hdd-o" style={{marginRight: '0.5em'}}/>
                    Install from local dir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{width: '100%', marginTop: '9em', padding: '2em'}}>
          <div style={galleryStyle}>
            {namespacesCards}
          </div>
          {filteredIndexList && filteredIndexList.length > limit &&
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4em'}}>
            <div
              ref={me => this.showMoreButton = me}
              className="btn btn-primary"
              onClick={this.handleShowMore}
            >
              Listed {namespacesCards.length} items. Show More...
            </div>
          </div>
          }
        </div>
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

