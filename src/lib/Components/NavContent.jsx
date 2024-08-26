import React, { useState } from 'react';

// components
import { SvgClockRewind, Svglayers } from '../SVGComps';

// css
import './NavContent.css';

function RecentFlow() {
	// 클릭 상태를 관리하는 state 추가
	const [isClicked, setIsClicked] = useState(false);

	const handleClick = () => {
		setIsClicked(!isClicked);
	};

	return (
		<div
			className={`contentContainer ${isClicked ? 'clicked' : ''}`} // 클릭 상태에 따라 클래스 동적 적용
			onClick={handleClick} // 클릭 이벤트 핸들러 추가
		>
			<div className='iconContainer'>
				<SvgClockRewind />
			</div>
			<div className='contentText'>Recents</div>
		</div>
	);
}

function TemplateFlow() {
	// 클릭 상태를 관리하는 state 추가
	const [isClicked, setIsClicked] = useState(false);

	const handleClick = () => {
		setIsClicked(!isClicked);
	};

	return (
		<div
			className={`contentContainer ${isClicked ? 'clicked' : ''}`} // 클릭 상태에 따라 클래스 동적 적용
			onClick={handleClick} // 클릭 이벤트 핸들러 추가
		>
			<div className='iconContainer'>
				<Svglayers />
			</div>
			<div className='contentText'>Templates</div>
		</div>
	);
}

export default function NavContent() {
	return (
		<div className='navContent'>
			<RecentFlow />
			<TemplateFlow />
		</div>
	);
}
