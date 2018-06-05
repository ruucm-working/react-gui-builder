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

const prefix = 'style.';

let stylePropsList = undefined;

const names = [
    'alignContent',
    'alignItems',
    'background',
    'backgroundAttachment',
    'backgroundColor',
    'backgroundImage',
    'backgroundPosition',
    'backgroundRepeat',
    'border',
    'borderBottom',
    'borderBottomColor',
    'borderBottomStyle',
    'borderBottomWidth',
    'borderColor',
    'borderLeft',
    'borderLeftColor',
    'borderLeftStyle',
    'borderLeftWidth',
    'borderRadius',
    'borderRight',
    'borderRightColor',
    'borderRightStyle',
    'borderRightWidth',
    'borderStyle',
    'borderTop',
    'borderTopColor',
    'borderTopStyle',
    'borderTopWidth',
    'borderWidth',
    'bottom',
    'clear',
    'clip',
    'color',
    'cursor',
    'display',
    'filter',
    'flexDirection',
    'flexFlow',
    'flexWrap',
    'font',
    'fontFamily',
    'fontSize',
    'fontVariant',
    'fontWeight',
    'height',
    'justifyContent',
    'left',
    'letterSpacing',
    'lineHeight',
    'listStyle',
    'listStyleImage',
    'listStylePosition',
    'listStyleType',
    'margin',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'overflow',
    'right',
    'padding',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'pageBreakAfter',
    'pageBreakBefore',
    'position',
    'cssFloat',
    'textAlign',
    'textDecoration',
    'textDecorationBlink',
    'textDecorationLineThrough',
    'textDecorationNone',
    'textDecorationOverline',
    'textDecorationUnderline',
    'textIndent',
    'textTransform',
    'top',
    'verticalAlign',
    'visibility',
    'width',
    'zIndex'
];

export function getStylePropList(){
    if(!stylePropsList){
        stylePropsList = [];
        names.forEach(name => {
            stylePropsList.push(prefix + name);
        });
    }
    return stylePropsList;
}
