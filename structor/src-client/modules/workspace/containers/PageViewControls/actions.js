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

import { deletePage as deleteDeskPage } from 'modules/workspace/containers/DeskPage/actions';
import { showModal } from 'modules/workspace/containers/PageOptionsModal/actions';
import { showModal as confirmModal } from 'modules/app/containers/ConfirmationModal/actions';

export const deletePage = () => (dispatch, getState) => {
  dispatch(confirmModal(
    '#### Are you sure you want to delete the current page?',
    () => {
      dispatch(deleteDeskPage());
    }
  ));
};

export const containerActions = (dispatch) => bindActionCreators({
    showModal, deletePage
}, dispatch);
