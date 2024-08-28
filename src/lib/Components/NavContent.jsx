import React from 'react';

import { navContentList } from '../Common/string';
// recoil
import { useRecoilState } from 'recoil';
import { SelectedNavContent } from '../RecoilAtom/recoilHomeState';

// components
import { SvgClockRewind, Svglayers } from '../SVGComps';

// css
import './NavContent.css';

function RecentFlow() {
	const [isClicked, setIsClicked] = React.useState(false);
	const [selectedNavContent, setSelectedNavContent] = useRecoilState(SelectedNavContent);

	React.useEffect(() => {
		if (selectedNavContent === navContentList.recents) {
			setIsClicked(true);
		} else setIsClicked(false);
	}, [selectedNavContent]);

	const handleClick = () => {
		setSelectedNavContent(navContentList.recents);
	};

	return (
		<div className={`contentContainer ${isClicked ? 'clicked' : ''}`} onClick={handleClick}>
			<div className='iconContainer'>
				<SvgClockRewind />
			</div>
			<div className='contentText'>{navContentList.recents}</div>
		</div>
	);
}

function TemplateFlow() {
	const [isClicked, setIsClicked] = React.useState(false);
	const [selectedNavContent, setSelectedNavContent] = useRecoilState(SelectedNavContent);

	React.useEffect(() => {
		if (selectedNavContent === navContentList.template) {
			setIsClicked(true);
		} else setIsClicked(false);
	}, [selectedNavContent]);

	const handleClick = () => {
		setSelectedNavContent(navContentList.template);
	};

	return (
		<div className={`contentContainer ${isClicked ? 'clicked' : ''}`} onClick={handleClick}>
			<div className='iconContainer'>
				<Svglayers />
			</div>
			<div className='contentText'>{navContentList.template}</div>
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
