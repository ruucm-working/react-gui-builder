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

import { set, has, get, forOwn, isObject, includes, merge } from 'lodash';
import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import { coockiesApi } from 'api';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import { styleGroups } from './constants';

import {
  OptionInput,
  CollapsiblePlusOptionInput,
  StyleSizeInput,
  StyleNumberInput,
  StyleOptionSelect,
  StyleSwatchesPicker,
} from 'components';

const style = {
  width: '100%',
  paddingTop: '5px',
  paddingRight: '5px',
  paddingLeft: '5px',
  paddingBottom: '10px',
  border: '1px solid #DBDBDB',
  borderRadius: '3px',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
};

const labelStyle = {
  backgroundColor: 'rgb(227, 227, 227)',
  color: 'rgb(107, 107, 107)',
  textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.handleAddNewProp = this.handleAddNewProp.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleToggleStyleSection = this.handleToggleStyleSection.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {componentModel: nextComponentModel, readmeText: nextReadmeText} = nextProps;
    const {componentModel, readmeText} = this.props;
    if (nextComponentModel !== componentModel) {
      coockiesApi.saveDeskSettings({optionsPanel: nextComponentModel});
    }
  }

  handleAddNewProp (options) {
    if (options.path && /^[a-zA-Z0-9.]+$/.test(options.path)) {
      let valueObject = {};
      if (/^[0-9.]+$/.test(options.value)) {
        set(valueObject, options.path, parseFloat(options.value));
      } else if (options.value === 'true') {
        set(valueObject, options.path, true);
      } else if (options.value === 'false') {
        set(valueObject, options.path, false);
      } else {
        set(valueObject, options.path, '' + options.value);
      }
      this.handleChangeOption(valueObject);
    }
  }

  handleChangeOption (optionObject) {
    const {selectedComponents, changeOption} = this.props;
    changeOption(selectedComponents, optionObject);
  }

  handleDeleteOption (path) {
    const {selectedComponents, deleteOption} = this.props;
    deleteOption(selectedComponents, path);
  }

  handleToggleOption = (valueObject) => (path, checked) => {
    const {selectedComponents, deleteOption, changeOption} = this.props;
    if (!checked) {
      deleteOption(selectedComponents, path);
    } else {
      changeOption(selectedComponents, valueObject);
    }
  };

  handleSelectTab (eventKey) {
    if (eventKey) {
      this.props.setActiveTab(eventKey);
    }
  }

  handleToggleStyleSection (e) {
    e.stopPropagation();
    e.preventDefault();
    const key = e.currentTarget.dataset.groupkey;
    this.props.toggleStyleSection(key);
  }

  handleToggleFavorite (stylePath) {
    this.props.toggleFavorite(stylePath);
  }

  render () {

    const {
      selectedComponents,
      componentModel: {activeTab, expandedStyleSections, favoriteStylePaths},
      propNames
    } = this.props;

    let panelContent = null;

    if (selectedComponents && selectedComponents.length > 0) {
      let key = 'selectedComponents';
      let props = {};
      selectedComponents.forEach(componentObject => {
        props = merge(props, componentObject.props);
      });

      let styleSections = [];
      let collapsed;
      let favoriteStyleInputs = [];
      let favoriteStyleSection = null;
      styleGroups.forEach((group, index) => {
        const {styleGroupKey, title, styles} = group;
        if (expandedStyleSections[styleGroupKey] === true) {
          collapsed = 'in';
        } else {
          collapsed = '';
        }
        let styleOptionInputs = [];
        let valueObject;
        let setCount = 0;
        let styleOptionInput;
        let isFavoriteOption;
        if (styles && styles.length > 0) {
          styles.forEach((style, index) => {
            let value = get(props, style.path);
            let isSet = false;
            if (value === undefined) {
              valueObject = set({}, style.path, style.value);
            } else {
              valueObject = set({}, style.path, value);
              isSet = true;
              setCount++;
            }
            isFavoriteOption = includes(favoriteStylePaths, style.path);
            styleOptionInput = null;
            if (style.type === 'number') {
              styleOptionInput = (
                <div
                  key={style.path + styleGroupKey}
                  className="list-group-item">
                  <StyleNumberInput
                    valueObject={valueObject}
                    path={style.path}
                    isSet={isSet}
                    onSet={this.handleToggleOption(valueObject)}
                    onChangeValue={this.handleChangeOption}
                    isFavorite={isFavoriteOption}
                    onToggleFavorite={this.handleToggleFavorite}
                  />
                </div>
              );
            } else if (style.type === 'size') {
              styleOptionInput = (
                <div
                  key={style.path + styleGroupKey}
                  className="list-group-item">
                  <StyleSizeInput
                    valueObject={valueObject}
                    path={style.path}
                    isSet={isSet}
                    onSet={this.handleToggleOption(valueObject)}
                    onChangeValue={this.handleChangeOption}
                    isFavorite={isFavoriteOption}
                    onToggleFavorite={this.handleToggleFavorite}
                  />
                </div>
              );
            } else if (style.type === 'select') {
              styleOptionInput = (
                <div
                  key={style.path + styleGroupKey}
                  className="list-group-item">
                  <StyleOptionSelect
                    valueObject={valueObject}
                    path={style.path}
                    valueList={style.options}
                    isSet={isSet}
                    onSet={this.handleToggleOption(valueObject)}
                    onChangeValue={this.handleChangeOption}
                    isFavorite={isFavoriteOption}
                    onToggleFavorite={this.handleToggleFavorite}
                  />
                </div>
              );
            } else if (style.type === 'color') {
              styleOptionInput = (
                <div
                  key={style.path + styleGroupKey}
                  className="list-group-item">
                  <StyleSwatchesPicker
                    valueObject={valueObject}
                    path={style.path}
                    isSet={isSet}
                    onSet={this.handleToggleOption(valueObject)}
                    onChangeValue={this.handleChangeOption}
                    isFavorite={isFavoriteOption}
                    onToggleFavorite={this.handleToggleFavorite}
                  />
                </div>
              );
            }
            if (styleOptionInput) {
              styleOptionInputs.push(styleOptionInput);
              if (includes(favoriteStylePaths, style.path)) {
                favoriteStyleInputs.push(styleOptionInput);
              }
            }
          });
          styleSections.push(
            <div key={styleGroupKey}
                 className="panel panel-default">
              <div className="panel-heading"
                   role="tab"
                   id={'heading' + styleGroupKey}>
                <p style={{margin: 0}}>
                  <a style={{outline: '0'}}
                     role="button"
                     data-groupkey={styleGroupKey}
                     href={'#' + styleGroupKey}
                     onClick={this.handleToggleStyleSection}>
                    {title}
                  </a>
                  {setCount > 0 &&
                  <span
                    className="label pull-right"
                    style={labelStyle}
                  >
                    {setCount}
                  </span>
                  }
                </p>
              </div>
              <div id={styleGroupKey}
                   className={'panel-collapse collapse ' + collapsed}
                   role="tabpanel">
                <div className="list-group">
                  {styleOptionInputs}
                </div>
                <div style={{height: '0'}}/>
              </div>
            </div>
          );
        }
      });
      if (favoriteStyleInputs.length > 0) {
        if (expandedStyleSections['favoriteStyleGroup'] === true) {
          collapsed = 'in';
        } else {
          collapsed = '';
        }
        favoriteStyleSection = (
          <div key="favoriteStyleGroup"
               className="panel panel-info">
            <div className="panel-heading"
                 role="tab"
                 id={'headingFavoriteStyleGroup'}>
              <p style={{margin: 0}}>
                <a style={{outline: '0'}}
                   role="button"
                   data-groupkey="favoriteStyleGroup"
                   href={'#favoriteStyleGroup'}
                   onClick={this.handleToggleStyleSection}>
                  Favorites
                </a>
              </p>
            </div>
            <div id="favoriteStyleGroup"
                 className={'panel-collapse collapse ' + collapsed}
                 role="tabpanel">
              <div className="list-group">
                {favoriteStyleInputs}
              </div>
              <div style={{height: '0'}}/>
            </div>
          </div>
        );
      }

      let optionInputs = [];

      forOwn(props, (value, prop) => {
        if (isObject(value)) {
          forOwn(value, (subValue, subProp) => {
            if (!isObject(subValue)) {
              let valueObject = {};
              let pathTo = prop + '.' + subProp;
              set(valueObject, pathTo, subValue);
              optionInputs.push(
                <OptionInput
                  key={pathTo + key}
                  style={{marginTop: '0.5em'}}
                  valueObject={valueObject}
                  path={pathTo}
                  onDeleteValue={this.handleDeleteOption}
                  onChangeValue={this.handleChangeOption}/>
              );
            }
          });
        } else {
          let valueObject = {};
          let pathTo = prop;
          set(valueObject, pathTo, value);
          optionInputs.push(
            <OptionInput
              key={pathTo + key}
              style={{marginTop: '0.5em'}}
              valueObject={valueObject}
              path={pathTo}
              onDeleteValue={this.handleDeleteOption}
              onChangeValue={this.handleChangeOption}/>
          );
        }
      });

      let tabPanes = [];
      tabPanes.push(
        <Tab
          key="quickProperties"
          eventKey={tabPanes.length + 1}
          title="Quick style">
          <div style={{width: '100%', marginTop: '1em'}}>
            <div
              className="panel-group"
              id="accordion"
              role="tablist"
              aria-multiselectable="true">
              {favoriteStyleSection}
              {styleSections}
            </div>
          </div>
        </Tab>
      );
      tabPanes.push(
        <Tab
          key="properties"
          eventKey={tabPanes.length + 1}
          title="Properties">
          <div style={{position: 'relative', marginTop: '1em'}}>
            <CollapsiblePlusOptionInput
              style={{width: '100%', zIndex: '1030', marginBottom: '0.5em'}}
              optionNames={propNames}
              onCommit={this.handleAddNewProp}
            />
          </div>
          {optionInputs}
        </Tab>
      );

      panelContent = (
        <div style={style}>
          <Tabs
            id="componentOptionsTabs"
            onSelect={this.handleSelectTab}
            activeKey={activeTab}>
            {tabPanes}
          </Tabs>
        </div>
      );
    } else {
      panelContent = (
        <div style={style}>
          <h4 className='text-center'>Properties are not available</h4>
        </div>
      );
    }
    return panelContent;
  }

}

export default connect(modelSelector, containerActions)(Container);
