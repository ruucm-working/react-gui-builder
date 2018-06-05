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

import * as DeskPageActions from '../actions/deskPageActions.js';

export function createComponentOverlay(actions, frameWindow, domNodeId, componentType, options) {

    const shortLabel = componentType || 'Unknown';

    //const hasMovableButtons = options['exProps'] === '/!#child';

    let overlayModel = {
        pageFrameWindow: frameWindow,
        onClose: actions.onClose,
        onClick: actions.onClick,
        buttons: []
    };
    overlayModel.buttons.push(
        {
            label: '&lt;' + shortLabel + '&gt;&nbsp;&nbsp;',
            icon: 'umyproto-icon-caret-down',
            btnClass: 'umyproto-button-success',
            menu: actions.menu || []
        });
    overlayModel.buttons.push(
        {
            icon: "umyproto-icon-code",
            tooltip: 'Show component in page treeview',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onCodeView
        });
    //if (hasMovableButtons) {
    //    overlayModel.buttons.push(
    //        {
    //            icon: 'umyproto-icon-arrow-up',
    //            tooltip: 'Move component up',
    //            btnClass: 'umyproto-button-primary',
    //            onClick: actions.onMoveUp
    //        });
    //    overlayModel.buttons.push(
    //        {
    //            icon: 'umyproto-icon-arrow-down',
    //            tooltip: 'Move component down',
    //            btnClass: 'umyproto-button-primary',
    //            onClick: actions.onMoveDown
    //        });
    //}
    overlayModel.buttons.push(
        {
            icon: 'umyproto-icon-cut',
            tooltip: 'Cut component into clipboard',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onCut
        });
    overlayModel.buttons.push(
        {
            icon: 'umyproto-icon-clipboard',
            tooltip: 'Copy component into clipboard',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onCopy
        });
    overlayModel.buttons.push(
        {
            icon: 'umyproto-icon-copy',
            tooltip: 'Duplicate component',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onDuplicate
        });
    overlayModel.buttons.push(
        {
            icon: 'umyproto-icon-trash-o',
            tooltip: 'Remove component from page',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onDelete
        });
    overlayModel.buttons.push(
        {
            icon: 'umyproto-icon-gears',
            tooltip: 'Show component options',
            btnClass: 'umyproto-button-primary',
            onClick: actions.onOptions
        });
    return $("<div></div>").umyComponentOverlay(overlayModel);
}

export function createCopyPasteOverlay(actions, frameWindow, componentType) {

    var shortLabel = componentType || 'Unknown';

    var overlayModel = {
        pageFrameWindow: frameWindow,
        onClose: actions.onClose,
        buttons: [
            {
                label: '&lt;' + shortLabel + '&gt;',
                btnClass: 'umyproto-button-success',
                onClick: actions.onLabel
            },
            {
                icon: "umyproto-icon-level-up",
                tooltip: 'Select parent component',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onLevelUp
            },
            {
                label: 'Before',
                tooltip: 'Add component from clipboard before selected one',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onAddBefore
            },
            {
                label: 'First',
                tooltip: 'Insert component from clipboard into selected one as the first child component',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onInsertFirst
            },
            {
                label: 'Wrap',
                tooltip: 'Wrap selected component with component from clipboard',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onWrap
            },
            {
                label: 'Replace',
                tooltip: 'Replace selected component with component from clipboard',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onReplace
            },
            {
                label: 'Last',
                tooltip: 'Insert component from clipboard into selected one as the last child component',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onInsertLast
            },
            {
                label: 'After',
                tooltip: 'Add component from clipboard after selected one',
                btnClass: 'umyproto-button-primary',
                onClick: actions.onAddAfter
            },
            {
                label: 'Cancel',
                tooltip: 'Clear clipboard',
                btnClass: 'umyproto-button-danger',
                onClick: actions.onCancel
            }
        ]
    };
    return $("<div></div>").umyComponentOverlay(overlayModel);
}

//};

//module.exports = Overlays;
