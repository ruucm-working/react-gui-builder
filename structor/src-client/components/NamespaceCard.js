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
import defaultScreenshotSrc from 'assets/app/css/img/screenshot.png';

const titleStyle = {
  margin: '0px',
  position: 'relative',
  padding: '3px',
  backgroundColor: '#f5f5f5',
  borderRadius: '3px'
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexFlow: 'nowrap',
  alignItems: 'center',
  width: '600px',
};
const screenshotSectionStyle = {
  flexGrow: 0,
  minWidth: '200px',
  width: '200px',
  padding: '0.5em',
};
const mainSectionStyle = {
  marginLeft: '1.5em',
  flexGrow: 2,
  padding: '0.5em 0.5em 0.5em 0',
  height: '200px',
  overflow: 'auto',
};
const installBtnSectionStyle = {
  flexGrow: 0,
  minWidth: '200px',
  width: '200px',
  padding: '0.5em',
  alignItems: 'center',
};
const bottomToolbarStyle = {
  flexGrow: 2,
  display: 'flex',
  flexDirection: 'row',
  padding: '0.5em 0.5em 0.5em 0',
  alignItems: 'center',
  justifyContent: 'flex-end',
};

class NamespaceCard extends Component {

  constructor (props) {
    super(props);
    this.handleInstallClick = this.handleInstallClick.bind(this);
  }

  handleInstallClick (e) {
    e.stopPropagation();
    e.preventDefault();
    const tarballUrl = e.currentTarget.dataset.url;
    const {onInstallClick} = this.props;
    if (onInstallClick) {
      onInstallClick(tarballUrl);
    }
  }

  render () {
    const {style, repoData, currentVersion} = this.props;
    const {
      gitHubRepo,
      gitHubOwner,
      description,
      screenshotUrl,
      releases,
      structorVersion
    } = repoData;
    const repoUrl = `https://github.com/${gitHubOwner}/${gitHubRepo}`;
    return (
      <div style={style}>
        <div className="panel panel-default">
          <div className="panel-body">
            <h5 style={titleStyle}>
              {releases && releases.length > 0 &&
              <div style={{display: 'inline'}}>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-url={releases[0].tarballUrl}
                    onClick={this.handleInstallClick}
                  >
                    <i className="fa fa-download"/>
                    <span style={{marginLeft: '0.5em'}}>
											Install
										</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-caret-down"/>
                  </button>
                  <ul className="dropdown-menu">
                    {releases.map((release, index) => {
                      return (
                        <li key={release.name + index}>
                          <a
                            href="#"
                            data-url={release.tarballUrl}
                            onClick={this.handleInstallClick}
                          >
                            <span>{release.name}</span>
                            {index === 0 &&
                            <i
                              className="fa fa-check"
                              style={{margin: '0 0.5em'}}
                            />
                            }
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              }
              <span style={{marginLeft: '1em'}}>{gitHubRepo}</span>
            </h5>
            <div style={containerStyle}>
              <div style={screenshotSectionStyle}>
                <img
                  style={{width: '100%'}}
                  src={screenshotUrl || defaultScreenshotSrc}
                  alt=""
                />
              </div>
              <div style={mainSectionStyle}>
                <h4>
                  {description}
                </h4>
              </div>
            </div>
            <div style={containerStyle}>
              <div style={installBtnSectionStyle}>
								<span
                  style={{marginRight: '0.5em'}}
                  title="Compatible Structor version with this package"
                >
									Structor version:
								</span>
                <span
                  className={structorVersion === currentVersion ? 'text-success' : 'text-danger'}
                  title={structorVersion === currentVersion ? 'Structor version is compatible' : 'Structor version is not compatible'}
                >
									{structorVersion}
								</span>
              </div>
              <div style={bottomToolbarStyle}>
                <div style={{marginLeft: '0.5em'}}>
                  <a
                    href={repoUrl}
                    className="btn btn-link"
                    target="_blank"
                  >
                    <i className="fa fa-github-alt"/>
                    <span style={{marginLeft: '0.5em'}}>
                                    Open on GitHub
                                	</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NamespaceCard;
