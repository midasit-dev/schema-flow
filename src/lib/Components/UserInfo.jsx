// UserInfo.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import { SvgDropdown, SvgLogOut, SvgLogin } from '../SVGComps';
import { Tooltip } from './Tooltip';

// css
import './UserInfo.css';

function DropDownButton({ name = 'ANONYMOUS' }) {
	return (
		<div id='userDropDownButton'>
			<div className='buttonContent'>
				<div id='userIcon'>{name.charAt(0).toUpperCase()}</div>
				<div id='userName'>{name}</div>
				<div className='userDropdownIconContainer'>
					<SvgDropdown />
				</div>
			</div>
		</div>
	);
}

function LogOutButton() {
	return (
		<Tooltip content='Logout' postion='down'>
			<div className='logIn-OutButtonIcon' onClick={() => {}}>
				<SvgLogOut />
			</div>
		</Tooltip>
	);
}

function LogInButton() {
	const navigate = useNavigate();

	return (
		<Tooltip content='Login' postion='down'>
			<div
				className='logIn-OutButtonIcon'
				onClick={() => {
					navigate('../login');
				}}
			>
				<SvgLogin />
			</div>
		</Tooltip>
	);
}

export default function UserInfo(props) {
	const { name } = props;
	return (
		<div id='userInfo'>
			<DropDownButton name={name} />
			{name === undefined || name === null ? <LogInButton /> : <LogOutButton />}
		</div>
	);
}
