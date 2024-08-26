import React from 'react';
import UserInfo from './UserInfo';
import NavContent from './NavContent';

export default function SideBar() {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<div id='userInfoComp' style={{ width: '100%', height: '48px' }}>
				<UserInfo />
			</div>
			<div id='sidebar-navContent' style={{ width: '100%', height: '48px' }}>
				<NavContent />
			</div>
		</div>
	);
}
