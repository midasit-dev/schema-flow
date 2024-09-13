import React from 'react';

import { navContentList } from '../Common/string';

// components
import Template from './Template';
import Recents from './Recents';
import { UserProjectsSkeleton } from './Skeleton/HomeSkeleton';

// css
import './UserProjects.css';

const MAX_ITEMS = 5;

export default function UserProjects({ navContent, windowSize }) {
	const [isLoading, setIsLoading] = React.useState(true);
	const [itemWidth, setItemWidth] = React.useState(200);
	const [itemsPerRow, setItemsPerRow] = React.useState(1);
	const containerRef = React.useRef(null);

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
	}, [navContent]);

	function handleLoading(isLoading) {
		setIsLoading(isLoading);
	}

	return (
		<div
			ref={containerRef}
			style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '10px' }}
		>
			{isLoading && (
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
			)}

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
					<Recents width={itemWidth} handleLoading={handleLoading} />
				)}
				{navContent === navContentList.template && (
					<Template width={itemWidth} handleLoading={handleLoading} />
				)}
			</div>
		</div>
	);
}
