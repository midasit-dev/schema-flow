import React from 'react';

import './UserFlow.css';

function SkeletonElement({ type }) {
	return <div className={`skeleton ${type}`}></div>;
}

function Skeleton() {
	return (
		<div className='skeleton-wrapper'>
			<div className='skeleton-flow'>
				<div className='skeleton-left-boxes'>
					<div className='skeleton-box' />
					<div className='skeleton-box' />
				</div>
				<div className='skeleton-line' />
				<div className='skeleton-box' />
				<div className='skeleton-line' />
				<div className='skeleton-right-box'>
					<div className='skeleton-box' />
				</div>
			</div>
			<SkeletonElement type='title' />
			<SkeletonElement type='text' />
		</div>
	);
}

export default function UserFlow() {
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}, []);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
			{isLoading ? <Skeleton /> : <div>Flow</div>}
		</div>
	);
}
