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

import * as actions from './actions.js';

const initialState = {
	marketIndexList: [],
	filteredIndexList: [],
	searchText: null,
	limit: 10,
};

export default (state = initialState, action = {}) => {

	const {type, payload} = action;

	if (type === actions.SET_MARKET_INDEX_LIST) {
		return Object.assign({}, state, {
			marketIndexList: [].concat(payload.indexList),
			filteredIndexList: [].concat(payload.indexList),
		});
	}

	if (type === actions.SHOW_MORE_NAMESPACES) {
		return Object.assign({}, state, {limit: state.limit + 10});
	}

	if (type === actions.SEARCH_NAMESPACES) {
        const searchWords = payload.trim().split(' ');
        if (searchWords && searchWords.length > 0) {
        	const filteredIndexList = state.marketIndexList.filter(i => {
        		let foundCount = 0;
        		let trimmedWord;
        		searchWords.forEach(word => {
        			trimmedWord = word.trim();
        			if (trimmedWord.length > 0 &&
						i.description &&
						i.description.toUpperCase().indexOf(trimmedWord.toUpperCase()) >= 0) {
        				foundCount++;
					}
				});
				return foundCount > 0;
			});
			return Object.assign({}, state, {
				filteredIndexList: filteredIndexList || [],
				searchText: payload,
			});
		}
	}

	if (type === actions.CLEAR_SEARCH_NAMESPACES) {
		return Object.assign({}, state, {
			filteredIndexList: [].concat(state.marketIndexList),
			searchText: '',
		});
	}

	return state;
}

