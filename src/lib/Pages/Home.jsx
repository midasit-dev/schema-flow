import React from 'react';
import SideBar from '../Components/SideBar';
import Template from '../Components/Template';
import UserFlow from '../Components/UserFlow';

import { SvgHome } from '../SVGComps';

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
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: windowSize.width < MIN_WIDTH ? 'column' : 'row',
			}}
		>
			{windowSize.width < MIN_WIDTH ? (
				<div
					style={{
						width: '100%',
						height: '50px',
						padding: '10px',
						borderBottom: '1px solid #e6e6e6',
					}}
				>
					<div
						style={{
							width: '30px',
							height: '30px',
							cursor: 'pointer',
						}}
					>
						<SvgHome />
					</div>
				</div>
			) : (
				<div
					style={{
						width: '10%',
						minWidth: '250px',
						height: '100%',
						borderRight: '1px solid #e6e6e6',
					}}
				>
					<SideBar />
				</div>
			)}
			<div
				style={{
					width: '90%',
					height: '100%',
					backgroundColor: '#FFF',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<div style={{ height: '20%' }}>
					<Template />
				</div>
				<div style={{ height: '80%' }}>
					<UserFlow />
				</div>
			</div>
		</div>
	);
}
