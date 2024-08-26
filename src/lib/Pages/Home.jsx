import React from 'react';
import SideBar from '../Components/SideBar';
import Template from '../Components/Template';
import UserFlow from '../Components/UserFlow';

import { SvgHome } from '../SVGComps';

// css
import './Home.css';

const MIN_WIDTH = 650; // 최소 너비

export default function Home() {
	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	React.useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className={`homeContainer ${windowSize.width < MIN_WIDTH ? 'columnLayout' : 'rowLayout'}`}>
			{windowSize.width < MIN_WIDTH ? (
				<div className='topBar'>
					<div className='homeIconContainer'>
						<SvgHome />
					</div>
				</div>
			) : (
				<div
					className='sideBarContainer'
					style={{
						width: `${windowSize.width * 0.1}px`,
					}}
				>
					<SideBar />
				</div>
			)}
			<div
				className='mainContent'
				style={{
					width: windowSize.width < MIN_WIDTH ? '100%' : `${windowSize.width * 0.9}px`,
				}}
			>
				<div className='selectedMenu'>Recents</div>
				<div className='userFlowContainer'>
					<UserFlow />
				</div>
			</div>
		</div>
	);
}
