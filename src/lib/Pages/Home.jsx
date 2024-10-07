import React from 'react';

// recoil
import { useRecoilValue } from 'recoil';
import { SelectedNavContent, TokenState } from '../RecoilAtom/recoilHomeState';

// Components
import SideBar from '../Components/SideBar';
import UserProjects from '../Components/UserProjects';
import { SvgHome, SvgBell } from '../Components/SVGComps';
import { fetchFunction } from '../Common/fetch';

// css
import './Home.css';

const MIN_WIDTH = 650; // 최소 너비

const initUserInfo = {
	id: null,
	email: '',
	subEmail: null,
	phone: '',
	name: '',
	lastName: null,
	profileName: '',
	midasUserId: '',
	companyName: null,
	country: '',
	languageType: '',
	lastPasswordUpdateDateTime: '2',
	emailAgreeType: '',
	emailAgreementUpdateDateTime: null,
	emailDisagreementUpdateDateTime: '',
	smsAgreeType: '',
	smsAgreementUpdateDateTime: null,
	smsDisagreementUpdateDateTime: '',
	telAgreeType: '',
	telAgreementUpdateDateTime: null,
	telDisagreementUpdateDateTime: '',
	isPhoneCertification: false,
	isPhoneCertificationSms: null,
	authorities: [],
	grade: '',
};

async function getUserInfo(token) {
	if (token === '' || token === null || token === undefined) return initUserInfo;

	const res = await fetchFunction({
		baseUrl: `https://members.midasuser.com/member/api/v1`,
		token: token,
	});

	if (res.ok) {
		const data = await res.json();
		return data;
	}
	return initUserInfo;
}

export default function Home() {
	const containerRef = React.useRef(null);
	const isScrollingTimeoutRef = React.useRef(null);
	const [isScrolling, setIsScrolling] = React.useState(false);
	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [userInfo, setUserInfo] = React.useState(null);
	const selectedNavContent = useRecoilValue(SelectedNavContent);
	const token = useRecoilValue(TokenState);

	const getUser = React.useCallback(async () => {
		if (token) {
			const res = await getUserInfo(token);
			setUserInfo(res);
		} else {
			setUserInfo(initUserInfo);
		}
	}, [token]);

	React.useEffect(() => {
		getUser();
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
					<SideBar userInfo={userInfo} />
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
