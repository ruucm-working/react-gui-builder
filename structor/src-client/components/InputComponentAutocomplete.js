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
import PropTypes from 'prop-types';

const HtmlComponents = [
  'input',
  'label',
  'fieldset',
  'button',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'span',
  'strong',
  'small',
  'em',
  'i',
  'div',
  'p',
  'path',
  'blockquote',
  'hr',
  'a',
  'select',
  'option',
  'img',
  'form',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'ol',
  'ul',
  'li',
  'dl',
  'dt',
  'dd',
  'pre',
  'code',
  'header',
  'main',
  'article',
  'nav',
  'aside',
  'footer'
];

const formGroupStyle = {
  position: 'relative'
};
const popupStyle = {
  position: 'absolute',
  display: 'block',
  top: '2em',
};
const popoverListStyle = {
  height: '5.5em',
  width: '15em',
  overflowX: 'auto',
};
const textProbeStyle = {
  padding: 0,
  margin: 0,
  position: 'absolute',
  color: 'transparent',
  zIndex: -1
};
const listItemSelectedStyle = {
  margin: 0,
  padding: '2px 4px',
  borderRadius: '3px',
  overflow: 'hidden',
};
const listItemStyle = {
  margin: 0,
  padding: '2px 4px',
  overflow: 'hidden',
};

const getCaretPosition = (input) => {
  return input.selectionDirection == 'backward' ? input.selectionStart : input.selectionEnd;
};

const getCaretPixelPosition = ($textProbe, textValue) => {
  $textProbe.text(textValue);
  return $textProbe.outerWidth();
};

class InputComponentAutocomplete extends Component {

  constructor (props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
    this.handleClickInput = this.handleClickInput.bind(this);
    this.selectListItem = this.selectListItem.bind(this);
    this.getText = this.getText.bind(this);
    this.state = {
      showPopup: false,
      popupValues: [],
      text: '',
      textPartIndex: -1,
      caretPosition: 0,
      caretPixelPosition: -1,
      selectedItemIndex: -1,
    };
  }

  componentWillMount () {
    this.delayedScrollToSelected = debounce((e) => {
      const list = this.popoverList;
      const element = this.selectedListItem;
      const scrollTop = list.scrollTop;
      const offsetTop = element.offsetTop;
      const delta = offsetTop - scrollTop;
      if (delta < 0) {
        list.scrollTop = scrollTop - 24;
      } else if (delta > 48) {
        list.scrollTop = scrollTop + 24;
      }
    }, 10);
  }

  componentWillUnmount () {
    this.delayedScrollToSelected.cancel;
  }

  componentDidMount () {
    this.input.focus();
  }

  handleKeyUp (e) {
    if (e.which === 37 || e.which === 39) {
      // arrow left and right
      this.handleTextChange(e);
    }
  }

  handleKeyDown (e) {
    if (e.which === 40 || e.which === 38) {
      e.stopPropagation();
      e.preventDefault();
      // arrow down and up
      const {showPopup, selectedItemIndex, popupValues} = this.state;
      if (showPopup) {
        if (selectedItemIndex < 0) {
          this.setState({selectedItemIndex: 0});
        } else {
          if (e.which === 40) {
            if (selectedItemIndex < popupValues.length - 1) {
              this.setState({selectedItemIndex: selectedItemIndex + 1});
              this.delayedScrollToSelected(e);
            }
          } else if (e.which === 38) {
            if (selectedItemIndex > 0) {
              this.setState({selectedItemIndex: selectedItemIndex - 1});
              this.delayedScrollToSelected(e);
            }
          }
        }
      }
    } else if (e.which === 13) {
      e.stopPropagation();
      e.preventDefault();
      const {showPopup, selectedItemIndex, textPartIndex, text} = this.state;
      if (showPopup && selectedItemIndex >= 0 && textPartIndex >= 0) {
        this.selectListItem(selectedItemIndex);
      } else {
        const {onSubmit} = this.props;
        if (onSubmit) {
          onSubmit(text);
        }
      }
    } else if (e.which === 27) {
      e.stopPropagation();
      e.preventDefault();
      const {showPopup} = this.state;
      if (showPopup) {
        this.setState({
          showPopup: false,
          popupValues: [],
          textPartIndex: -1,
          caretPosition: 0,
          caretPixelPosition: -1,
          selectedItemIndex: -1,
        });
      } else {
        const {onCancel} = this.props;
        if (onCancel) {
          onCancel();
        }
      }
    }
  }

  handleTextChange (e) {
    let text = e.currentTarget.value;
    if (text && text.length > 0) {
      let values = [];
      const caretPosition = getCaretPosition(this.input);
      const textParts = text.split('.');
      let textPart;
      let textPartLengthCumulative = 0;
      let checkPart;
      let checkPartIndex = -1;
      let caretPixelPosition = -1;
      textParts.forEach((p, partIndex) => {
        if (p && p.length > 0) {
          if (caretPosition > textPartLengthCumulative
            && (textPartLengthCumulative + p.length) >= caretPosition) {
            checkPart = text.substr(textPartLengthCumulative, caretPosition - textPartLengthCumulative);
            textPart = p;
            checkPartIndex = partIndex;
          }
          textPartLengthCumulative += p.length + 1;
        }
      });
      if (checkPart && checkPart.length > 0) {
        caretPixelPosition = getCaretPixelPosition(this.$textProbe, text.substr(0, caretPosition));
        const checkText = checkPart.toUpperCase();
        values = this.props.componentNames.filter(i => i.toUpperCase().indexOf(checkText) >= 0);
        values.sort((a, b) => {
          const eq = a.toUpperCase().indexOf(checkText) - b.toUpperCase().indexOf(checkText);
          if (eq === 0) {
            return a.length - b.length;
          } else {
            return eq;
          }
        });
        if (values.length === 1 && checkText === values[0].toUpperCase()) {
          values = [];
        }
      }
      this.setState({
        showPopup: values.length > 0,
        popupValues: values,
        text: text,
        textPartIndex: checkPartIndex,
        caretPosition: caretPosition,
        caretPixelPosition: caretPixelPosition,
        selectedItemIndex: values.length > 0 ? 0 : -1,
      });
    } else {
      this.setState({
        showPopup: false,
        popupValues: [],
        text: text,
        textPartIndex: -1,
        caretPosition: 0,
        caretPixelPosition: -1,
        selectedItemIndex: -1,
      });
    }
  }

  handleClickListItem (e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.selectListItem(e.currentTarget.dataset.index);
    this.input.focus();
  }

  handleClickInput (e) {
    this.handleTextChange(e);
  }

  selectListItem (index) {
    const {popupValues, textPartIndex, text} = this.state;
    let textParts = text.split('.');
    if (textPartIndex < textParts.length) {
      textParts[textPartIndex] = popupValues[index];
    }
    this.setState({
      text: textParts.join('.'),
      showPopup: false,
      popupValues: [],
      textPartIndex: -1,
      caretPosition: 0,
      caretPixelPosition: -1,
      selectedItemIndex: -1,
    });
  }

  getText () {
    return this.state.text;
  }

  render () {
    const {showPopup, popupValues, text, caretPixelPosition, selectedItemIndex} = this.state;
    let popupStylePositioned = undefined;
    if (showPopup) {
      popupStylePositioned = Object.assign({}, popupStyle, {
        left: 'calc(' + caretPixelPosition + 'px - 7.7em)',
      });
    }
    return (
      <div style={{padding: '1em'}}>
        <label>Enter name or names separated by dot</label>
        <div
          className="form-group"
          style={formGroupStyle}>
          <input
            ref={me => {
              this.input = me;
            }}
            className="form-control"
            onChange={this.handleTextChange}
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown}
            onClick={this.handleClickInput}
            value={text}/>
          <span
            style={textProbeStyle}
            ref={me => {
              this.$textProbe = $(me);
            }}>
                            Probe
                        </span>
          <div
            className="panel panel-default"
            style={{marginTop: '1em'}}>
            <div className="panel-body">
              <p>Type the name of single component.</p>
              <p>Or you may type the construction of nested components:
                <strong>&nbsp;component1.component2.componentN</strong>
              </p>
              <p>Press enter to submit.</p>
            </div>
          </div>
          {showPopup &&
          <div
            className="popover bottom"
            style={popupStylePositioned}>
            <div className="arrow"/>
            <div className="popover-content">
              <div
                ref={me => this.popoverList = me}
                style={popoverListStyle}>
                {popupValues.map((item, index) => {
                  if (selectedItemIndex >= 0 && index === selectedItemIndex) {
                    return (
                      <p
                        key={item + index}
                        ref={me => this.selectedListItem = me}
                        className="bg-primary"
                        style={listItemSelectedStyle}>
												<span
                          style={{cursor: 'pointer'}}
                          data-index={index}
                          onClick={this.handleClickListItem}>
													{item}
												</span>
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={item + index}
                        style={listItemStyle}>
                        <a
                          href="#"
                          data-index={index}
                          onClick={this.handleClickListItem}>
                          {item}
                        </a>
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

InputComponentAutocomplete.propTypes = {
  componentNames: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

InputComponentAutocomplete.defaultProps = {
  componentNames: HtmlComponents,
  onSubmit: (text) => console.log('Submitting text: ', text),
  onCancel: () => console.log('Cancelling'),
};

export default InputComponentAutocomplete;
