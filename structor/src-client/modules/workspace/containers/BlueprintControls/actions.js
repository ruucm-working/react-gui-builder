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

import { bindActionCreators } from 'redux';
import { coockiesApi } from 'api';
import { updatePage } from 'modules/workspace/containers/DeskPage/actions';

export const SET_SHOW_BUTTONS = 'BlueprintControls/SET_SHOW_BUTTONS';

export const setShowButtons = (showBlueprintButtons) => (dispatch, getState) => {
  coockiesApi.saveDeskSettings({showBlueprintButtons});
  dispatch({type: SET_SHOW_BUTTONS, payload: showBlueprintButtons});
  dispatch(updatePage());
};

export const containerActions = (dispatch) => bindActionCreators({
  setShowButtons
}, dispatch);
