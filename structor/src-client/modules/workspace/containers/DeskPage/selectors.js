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

import { createSelector, createStructuredSelector } from 'reselect';
import { showBlueprintButtonsSelector } from 'modules/workspace/containers/BlueprintControls/selectors';

export const pagesSelector = state => state.deskPage.pages;
export const deskPageSelector = state => state.deskPage;

export const currentPageSelector = createSelector(
  deskPageSelector,
  (deskPage) => {
    const {currentPageIndex, currentPageName, currentPagePath} = deskPage;
    return {
      pageIndex: currentPageIndex,
      pageName: currentPageName,
      pagePath: currentPagePath,
    };
  }
);

export const modelSelector = createStructuredSelector({
  componentModel: state => state.deskPage,
  clipboardIndicatorModel: state => state.clipboardIndicator,
  selectionBreadcrumbsModel: state => state.selectionBreadcrumbs,
  showBlueprintButtons: showBlueprintButtonsSelector,
});
