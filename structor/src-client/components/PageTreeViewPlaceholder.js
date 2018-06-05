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
import React, {Component} from 'react';

const lineStyle = {
	height: '0.8em',
};

const holderStyle = {
	width: '1em',
	height: '1em',
  marginLeft: '2em',
	marginTop: '-.1em',
};

class PageTreeViewPlaceholder extends Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.stopPropagation();
		e.preventDefault();
		const {onClick, itemKey} = this.props;
		if(onClick){
			onClick(itemKey);
		}
	};

	render() {
		const {iconClassName, itemKey, title, onMouseEnter, onMouseLeave} = this.props;
		const icon = iconClassName ? iconClassName : 'fa fa-plus';
		return (
			<li style={lineStyle}>
				<div
					className="treeview-placeholder"
					title={title || "Paste component here"}
					style={holderStyle}
					data-key={itemKey}
					onClick={this.handleClick}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				>
					<div className="treeview-placeholder-base">
						<i className={icon + " treeview-placeholder-icon"} />
						<div className="treeview-placeholder-bar" />
					</div>
				</div>
			</li>
		);
	}
}

export default PageTreeViewPlaceholder;