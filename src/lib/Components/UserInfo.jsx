// UserInfo.jsx
import React from 'react';

// components
import { SvgDropdown, SvgLogOut } from '../SVGComps';
import { Tooltip } from './Tooltip';

// css
import './UserInfo.css';

function DropDownButton() {
	return (
		<div id='userDropDownButton'>
			<div className='buttonContent'>
				<div id='userIcon'>L</div>
				<div id='userName'>LEEHAYOUNG</div>
				<div className='userDropdownIconContainer'>
					<SvgDropdown />
				</div>
			</div>
		</div>
	);
}

function LogOutButton() {
	return (
		<Tooltip content="Logout" postion="down">
			<div id='logOutButtonIcon'>
				<SvgLogOut />
			</div>
		</Tooltip>
	);
}

export default function UserInfo() {
	return (
		<div id='userInfo'>
			<DropDownButton />
			<LogOutButton />
		</div>
	);
}
