import React from 'react';
import rss from 'react-secure-storage';

// recoil
import { useRecoilValue } from 'recoil';
import { SelectedNavContent } from '../RecoilAtom/recoilHomeState';

// Components
import SideBar from '../Components/SideBar';
import UserProjects from '../Components/UserProjects';
import { SvgHome, SvgBell } from '../Components/SVGComps';

// css
import './Home.css';

const MIN_WIDTH = 650; // 최소 너비

export default function Home() {
	const containerRef = React.useRef(null);
	const isScrollingTimeoutRef = React.useRef(null);
	const [isScrolling, setIsScrolling] = React.useState(false);
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

	React.useEffect(() => {
		const container = containerRef.current;

		const handleScroll = () => {
			setIsScrolling(true);

			// 스크롤 중지 후 1초 뒤에 숨김
			if (isScrollingTimeoutRef.current) {
				clearTimeout(isScrollingTimeoutRef.current);
			}
			isScrollingTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false);
			}, 1000);
		};

		container.addEventListener('scroll', handleScroll);

		return () => {
			container.removeEventListener('scroll', handleScroll);
			if (isScrollingTimeoutRef.current) {
				clearTimeout(isScrollingTimeoutRef.current);
			}
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
						<SvgBell />
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
						<div className='menuName'>{selectedNavContent}</div>
						<div className='bellIconContainer'>
							<SvgBell />
						</div>
					</div>
				)}
				<div
					ref={containerRef}
					className={`userFlowContainer ${isScrolling ? 'show-scrollbar' : ''}`}
				>
					<UserProjects navContent={selectedNavContent} windowSize={windowSize} />
				</div>
			</div>
		</div>
	);
}
