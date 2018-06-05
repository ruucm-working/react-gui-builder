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

export const styleGroups = [
	{
		styleGroupKey: '01',
		title: 'Layout',
		styles: [
			{path: 'style.display', type: 'select', value: 'block', options: [
				'block', 'inline-block', 'flex', 'inline', 'none',
				// 'contents', 'list-item', 'inline-table',
				// 'table', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group',
				// 'table-header-group', 'table-row', 'table-row-group', 'inline-flex', 'grid',
				// 'inline-grid', 'ruby', 'ruby-base', 'ruby-text', 'ruby-base-container', 'ruby-text-container',
				// 'run-in', 'inherit', 'initial', 'unset',
			]},
			{path: 'style.flexDirection', type: 'select', value: 'row', options: [
				'row',
				'row-reverse',
				'column',
				'column-reverse',
			]},
			{path: 'style.justifyContent', type: 'select', value: 'flex-start', options: [
				'flex-start',
				'flex-end',
				'center',
				'space-between',
				'space-around',
				'space-evenly',
			]},
			{path: 'style.alignItems', type: 'select', value: 'flex-start', options: [
				'flex-start',
				'flex-end',
				'center',
				'baseline',
			]},
			{path: 'style.alignContent', type: 'select', value: 'flex-start', options: [
				'flex-start',
				'flex-end',
				'center',
				'space-between',
				'space-around',
				'stretch',
			]},
			{path: 'style.alignSelf', type: 'select', value: 'auto', options: [
				'auto',
				'flex-start',
				'flex-end',
				'center',
				'baseline',
				'stretch',
			]},
			{path: 'style.flexWrap', type: 'select', value: 'nowrap', options: [
				'nowrap',
				'wrap',
				'wrap-reverse',
			]},
			{path: 'style.flexGrow', type: 'number', value: 1},
			{path: 'style.flexShrink', type: 'number', value: 1},
			{path: 'style.order', type: 'number', value: 1},
		],
	},
	{
		styleGroupKey: '02',
		title: 'Box Model',
		styles: [
			{path: 'style.height', type: 'size', value: '100%'},
			{path: 'style.width', type: 'size', value: '100%'},
			{path: 'style.margin', type: 'size', value: '5px'},
			{path: 'style.padding', type: 'size', value: '5px'},
			{path: 'style.marginTop', type: 'size', value: '5px'},
			{path: 'style.marginRight', type: 'size', value: '5px'},
			{path: 'style.marginBottom', type: 'size', value: '5px'},
			{path: 'style.marginLeft', type: 'size', value: '5px'},
			{path: 'style.paddingTop', type: 'size', value: '5px'},
			{path: 'style.paddingRight', type: 'size', value: '5px'},
			{path: 'style.paddingBottom', type: 'size', value: '5px'},
			{path: 'style.paddingLeft', type: 'size', value: '5px'},
			{path: 'style.overflow', type: 'select', value: 'auto', options: [
				'visible',
				'hidden',
				'scroll',
				'auto',
			]},
			{path: 'style.overflowX', type: 'select', value: 'auto', options: [
				'visible',
				'hidden',
				'scroll',
				'auto',
			]},
			{path: 'style.overflowY', type: 'select', value: 'auto', options: [
				'visible',
				'hidden',
				'scroll',
				'auto',
			]},
		],
	},
	{
		styleGroupKey: '03',
		title: 'Content',
		styles: [
			{path: 'style.color', type: 'color', value: '#ffffff'},
			{path: 'style.backgroundColor', type: 'color', value: '#ffffff'},
			{path: 'style.fontSize', type: 'size', value: '12px'},
			{path: 'style.fontWeight', type: 'number', value: 300},
			{path: 'style.fontStyle', type: 'select', value: 'normal', options: [
				'normal',
				'italic',
				'oblique',
			]},
			{path: 'style.textOverflow', type: 'select', value: 'clip', options: [
				'clip',
				'ellipsis',
			]},
			{path: 'style.cursor', type: 'select', value: 'auto', options: [
				'pointer',
				'context-menu',
				'help',
				'progress',
				'wait',
				'cell',
				'crosshair',
				'text',
				'vertical-text',
				'alias',
				'copy',
				'move',
				'no-drop',
				'not-allowed',
				'all-scroll',
				'col-resize',
				'row-resize',
				'n-resize',
				'e-resize',
				's-resize',
				'ew-resize',
				'ns-resize',
				'zoom-in',
				'zoom-out',
				'grab',
				'grabbing',
			]},
			{path: 'style.lineHeight', type: 'size', value: '14px'},
			{path: 'style.opacity', type: 'number', value: 0.9},
		],
	},
	{
		styleGroupKey: '04',
		title: 'Positioning',
		styles: [
			{path: 'style.position', type: 'select', value: 'relative', options: [
				'static',
				'relative',
				'absolute',
				'fixed',
				'sticky',
			]},
			{path: 'style.top', type: 'size', value: '0px'},
			{path: 'style.right', type: 'size', value: '0px'},
			{path: 'style.bottom', type: 'size', value: '0px'},
			{path: 'style.left', type: 'size', value: '0px'},
			{path: 'style.zIndex', type: 'number', value: 0},
			{path: 'style.float', type: 'select', value: 'none', options: [
				'left',
				'right',
				'inline-start',
				'inline-end',
				'none'
			]},
		],
	},
	{
		styleGroupKey: '05',
		title: 'Text',
		styles: [
			{path: 'style.textAlign', type: 'select', value: 'start', options: [
				'left',
				'right',
				'center',
				'justify',
				'justify-all',
				'start',
				'end',
				'match-parent',
			]},
			{path: 'style.whiteSpace', type: 'select', value: 'normal', options: [
				'normal',
				'nowrap',
				'pre',
				'justify',
				'pre-wrap',
				'pre-line',
			]},
			{path: 'style.letterSpacing', type: 'size', value: '1px'},
			{path: 'style.textTransform', type: 'select', value: 'none', options: [
				'capitalize',
				'uppercase',
				'lowercase',
				'none',
				'full-width',
			]},
			{path: 'style.textDecoration', type: 'select', value: 'none', options: [
				'none',
				'underline red',
				'underline wavy red',
			]},
			{path: 'style.wordBreak', type: 'select', value: 'normal', options: [
				'normal',
				'break-all',
				'keep-all',
			]},
			{path: 'style.wordSpacing', type: 'size', value: '5px'},
		],
	},
	{
		styleGroupKey: '06',
		title: 'Border',
		styles: [
			{path: 'style.borderStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.borderWidth', type: 'size', value: '1px'},
			{path: 'style.borderColor', type: 'color', value: '#ffffff'},
			{path: 'style.borderRadius', type: 'size', value: '3px'},

			{path: 'style.borderTopStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.borderTopWidth', type: 'size', value: '1px'},
			{path: 'style.borderTopColor', type: 'color', value: '#ffffff'},

			{path: 'style.borderRightStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.borderRightWidth', type: 'size', value: '1px'},
			{path: 'style.borderRightColor', type: 'color', value: '#ffffff'},

			{path: 'style.borderBottomStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.borderBottomWidth', type: 'size', value: '1px'},
			{path: 'style.borderBottomColor', type: 'color', value: '#ffffff'},

			{path: 'style.borderLeftStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.borderLeftWidth', type: 'size', value: '1px'},
			{path: 'style.borderLeftColor', type: 'color', value: '#ffffff'},

			{path: 'style.borderTopLeftRadius', type: 'size', value: '3px'},
			{path: 'style.borderTopRightRadius', type: 'size', value: '3px'},
			{path: 'style.borderBottomLeftRadius', type: 'size', value: '3px'},
			{path: 'style.borderBottomRightRadius', type: 'size', value: '3px'},
		],
	},
	{
		styleGroupKey: '07',
		title: 'Outline',
		styles: [
			{path: 'style.outlineStyle', type: 'select', value: 'solid', options: [
				'solid',
				'dashed',
				'dotted',
				'double',
				'hidden',
				'none',
			]},
			{path: 'style.outlineWidth', type: 'size', value: '2px'},
			{path: 'style.outlineColor', type: 'color', value: '#ffffff'},
			{path: 'style.outlineOffset', type: 'size', value: '2px'},
		],
	},
];

export const initialExpandedStyleGroups = {
	'03': true,
};
