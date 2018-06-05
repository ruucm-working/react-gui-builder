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
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import marked from 'marked';

const closeButtonStyle = {
  position: 'absolute',
  top: '-0.5em',
  right: '-0.5em',
  width: '1em',
  height: '1em',
  fontSize: '24px',
  cursor: 'pointer',
  zIndex: '100',
  opacity: '0.5'
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.state = {
      isExpanded: false
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.name === nextProps.name;
  }

  handleOnSelect (e) {
    e.preventDefault();
    e.stopPropagation();
    const {name, dirPath, startGeneratorWizard} = this.props;
    startGeneratorWizard(name, dirPath);
  }

  handleExpand (e) {
    e.preventDefault();
    e.stopPropagation();
    const {isExpanded} = this.state;
    if (isExpanded) {
      const panelOffset = $(this.panel).offset();
      const $body = $('#containerElement');
      let diff = (panelOffset.top + $body.scrollTop()) - $body.offset().top;
      let margin = 90;
      $body.animate(
        {scrollTop: (diff - margin)},
        300
      );
      setTimeout(() => {
        this.setState({isExpanded: !isExpanded});
      }, 300);
    } else {
      this.setState({isExpanded: !isExpanded});
    }
  }

  render () {
    const {isExpanded} = this.state;
    const {name, readmeText, screenshotFilePath, isRecentPanel, removeFromRecentGenerators} = this.props;

    return (
      <div ref={me => this.panel = me}>
        <Panel>
          { isRecentPanel ? <i style={closeButtonStyle}
                               title="Remove from recently used list"
                               className="fa fa-times-circle"
                               onClick={() => {removeFromRecentGenerators(name);}}/>
            : null
          }
          <h5 style={{
            margin: '0px',
            position: 'relative',
            padding: '3px',
            backgroundColor: '#f5f5f5',
            borderRadius: '3px'
          }}>
            <div style={{display: 'inline'}}>
              <Button
                id="selectButton"
                onClick={this.handleOnSelect}
                title="Generate"
                bsStyle="default"
              >
                <i className="fa fa-gears" style={{marginRight: '0.3em'}}/>
                Generate
              </Button>
            </div>
            <span style={{marginLeft: '1em'}}>{name}</span>
          </h5>
          <Grid fluid={ true }>
            <Row>
              <Col
                xs={ 12 }
                md={ 8 }
                sm={ 8 }
                lg={ 8 } style={{paddingLeft: '0px'}}>
                <div style={{height: isExpanded ? '100%' : '20em', overflow: 'hidden'}}>
                  <div dangerouslySetInnerHTML={{__html: marked(readmeText)}} />
                </div>
              </Col>
              <Col
                xs={ 12 }
                md={ 4 }
                sm={ 4 }
                lg={ 4 }>
                <div style={{height: isExpanded ? '100%' : '20em', overflow: 'hidden', marginTop: '0.2em'}}>
                  <img
                    src={screenshotFilePath}
                    style={{'width': '100%'}}/>
                </div>
              </Col>
            </Row>
          </Grid>
          <div style={{margin: '1em 0px 0px 0px', width: '100%'}}>
            <a href="#"
               onClick={this.handleExpand}>
              <i className={'fa ' + (isExpanded ? 'fa-caret-up' : 'fa-caret-down')}/>
              <span style={{marginLeft: '0.5em'}}>{isExpanded ? 'Read less' : 'Read more'}</span>
            </a>
          </div>
        </Panel>
      </div>
    );
  }
}

Container.defaultProps = {
  name: '',
  dirPath: undefined,
  readmeFilePath: undefined,
  screenshotFilePath: undefined,
  readmeText: undefined,
  isRecentPanel: false,
};
Container.propTypes = {
  name: PropTypes.string.isRequired,
  dirPath: PropTypes.string.isRequired,
  readmeFilePath: PropTypes.string.isRequired,
  screenshotFilePath: PropTypes.string.isRequired,
  readmeText: PropTypes.string.isRequired,
  isRecentPanel: PropTypes.bool,
};

export default connect(modelSelector, containerActions)(Container);

