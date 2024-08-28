import React from 'react';
import rss from 'react-secure-storage';

// recoil
import { useRecoilValue } from 'recoil';
import { SelectedNavContent } from '../RecoilAtom/recoilHomeState';

// Components
import SideBar from '../Components/SideBar';
import UserProjects from '../Components/UserProjects';
import { SvgHome, Svgbell } from '../SVGComps';

// css
import './Home.css';

const MIN_WIDTH = 650; // 최소 너비

export default function Home() {
	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const selectedNavContent = useRecoilValue(SelectedNavContent);

	React.useEffect(() => {
		const token = rss.getItem('token');
		console.log('token', token);

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
					<div className='selectedMenuNarrow'>{selectedNavContent}</div>
					<div className='bellIconContainer'>
						<Svgbell />
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
				{windowSize.width > MIN_WIDTH && (
					<div className='selectedMenuWide'>
						<div className='menuName'>
							{selectedNavContent}
						</div>
						<div className='bellIconContainer'>
							<Svgbell />
						</div>
					</div>
				)}
				<div className='userFlowContainer'>
					<UserProjects navContent={selectedNavContent} windowSize={windowSize} />
				</div>
			</div>
		</div>
	);
}
