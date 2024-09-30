import React from 'react';

import { navContentList } from '../Common/string';
import { fetchFunction } from '../Common/fetch';
// recoil
import { useRecoilState } from 'recoil';
import { TokenState } from '../RecoilAtom/recoilHomeState';

// components
import Template from './Template';
import Recents from './Recents';
import { UserProjectsSkeleton } from './Skeleton/HomeSkeleton';

// css
import './UserProjects.css';

const MAX_ITEMS = 5;

async function getFlowProjects(token) {
	const res = await fetchFunction({
		baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas`,
		tokenHeaderKey: 'Authorization',
		token: token,
	});

	if (res.ok) {
		const data = await res.json();
		return data;
	}
	return null;
}

async function getFlowTemplates() {
	const res = await fetchFunction({
		baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`,
	});
	if (res.ok) {
		const data = await res.json();
		console.log('Template:', data);
		return data;
	}
	return [];
}

export default function UserProjects({ navContent, windowSize }) {
	const containerRef = React.useRef(null);

	const [isLoading, setIsLoading] = React.useState(true);
	const [itemWidth, setItemWidth] = React.useState(200);
	const [itemsPerRow, setItemsPerRow] = React.useState(1);
	const [recentFlowProjects, setRecentFlowProjects] = React.useState([]);
	const [templateList, setTemplateList] = React.useState([]);

	const [token, setToken] = useRecoilState(TokenState);

	React.useEffect(() => {
		const containerWidth = containerRef?.current?.clientWidth || 1;
		const MAX_ITEM_WIDTH = 400;
		const MIN_ITEM_WIDTH = 300;

		const calculatedItemWidth = Math.max(
			MIN_ITEM_WIDTH,
			Math.min(
				containerWidth / Math.floor(containerWidth / MAX_ITEM_WIDTH),
				containerWidth / Math.floor(containerWidth / MIN_ITEM_WIDTH),
			),
		);

		const itemsPerRow = Math.floor(containerWidth / calculatedItemWidth);

		setItemWidth(calculatedItemWidth);
		setItemsPerRow(itemsPerRow);
	}, [windowSize, MAX_ITEMS]);

	React.useEffect(() => {
		setIsLoading(true);
		let ignore = false;

		async function getFlowProjectsData() {
			// const result = await GetToken(token, setToken, acc, setAcc);
			// if (result === 'acc is empty') navigate('../login');
			const projectlist = await getFlowProjects(token);
			if (projectlist === null) {
				console.error('Failed to get flow projects');
				return;
			}

			if (!ignore) setRecentFlowProjects(projectlist);
			handleLoading(false);
		}

		async function getFlowTemplatesData() {
			const templatelist = await getFlowTemplates();
			if (!ignore) setTemplateList(templatelist);
			handleLoading(false);
		}

		if (navContent === navContentList.recents) {
			getFlowProjectsData();
		} else if (navContent === navContentList.template) {
			getFlowTemplatesData();
		}

		return () => {
			ignore = true;
		};
	}, [navContent, token]);

	function handleLoading(isLoading) {
		setIsLoading(isLoading);
	}

	return (
		<div
			ref={containerRef}
			style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '10px' }}
		>
			{isLoading ? (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
						gap: '30px',
						width: '100%',
						justifyContent: 'space-between',
						justifyItems: 'center',
						gridAutoRows: 'max-content',
					}}
				>
					{Array.from({ length: itemsPerRow * 10 }).map((_, index) => (
						<UserProjectsSkeleton key={index} width={itemWidth} />
					))}
				</div>
			) : (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
						gap: '30px',
						width: '100%',
						justifyContent: 'space-between',
						gridAutoRows: 'max-content',
					}}
				>
					{navContent === navContentList.recents && (
						<Recents width={itemWidth} flowProjectList={recentFlowProjects} />
					)}
					{navContent === navContentList.template && (
						<Template width={itemWidth} templateList={templateList} />
					)}
				</div>
			)}
		</div>
	);
}
