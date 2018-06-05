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
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions, FAILED, TIMEOUT } from './actions.js';

const style = {
  position: 'relative',
  color: '#ffffff',
  borderRadius: '4px',
  border: '1px solid #ffffff',
  verticalAlign: 'middle',
  textAlign: 'left',
  padding: '1.5em',
  marginBottom: '0.5em',
  fontSize: '12px'
};
const buttonStyle = {
  position: 'absolute',
  top: '0px',
  right: '0px',
  width: '1em',
  height: '1em',
  color: '#fff',
  borderRadius: '50%',
  verticalAlign: 'middle',
  textAlign: 'center',
  cursor: 'pointer',
  fontSize: '18px'
};

const overlayStyle = {
  position: 'fixed',
  width: '30em',
  padding: '.5em 1.5em .5em .5em',
  right: '0px',
  top: '0px',
  zIndex: '9999'
};

class Container extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this._mountNode = document.createElement('div');
    this._mountNode.style['z-index'] = '9999';
    document.body.appendChild(this._mountNode);
    ReactDOM.render(this._overlay, this._mountNode);
  }

  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this._mountNode);
    this._mountNode = null;
  }

  componentDidUpdate () {
    if (this._mountNode) {
      ReactDOM.render(this._overlay, this._mountNode);
    }
  }

  handleShowDetails = (text) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.showModal(text);
  };

  render () {
    const {componentModel: {messages}, close} = this.props;
    if (messages.size > 0) {
      let messagesItems = [];
      messages.forEach((item, key) => {
        let messageStyle = Object.assign({}, style);
        if (item.type === FAILED || item.type === TIMEOUT) {
          messageStyle.backgroundColor = '#C90008';
        } else {
          messageStyle.backgroundColor = '#5cb85c';
        }
        let messageText = item.text;
        let textNeedCut = messageText && messageText.length > 300;
        if (textNeedCut) {
          messageText = messageText.substr(0, 300) + '...';
        }
        messagesItems.push(
          <div
            key={key}
            style={messageStyle}>
            {messageText &&
            <div
              style={{wordWrap: 'break-word'}}
              dangerouslySetInnerHTML={{__html: marked(messageText)}}
            />
            }
            { textNeedCut ? <p style={{margin: '0.5em 0 0 0', cursor: 'pointer'}}>
              <a
                href="#"
                style={{color: '#35b3ee'}}
                onClick={this.handleShowDetails(item.text)}
              >
                <span>[Read more]</span>
              </a>
            </p>
              : null
            }
            <span
              style={buttonStyle}
              className="fa fa-times"
              onClick={() => {close(key);}}
            />
          </div>
        );
      });

      this._overlay = (
        <div
          style={overlayStyle}
        >
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            {messagesItems}
          </div>

        </div>
      );
    } else {
      this._overlay = (
        <span />
      );
    }
    return (
      <span />
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

