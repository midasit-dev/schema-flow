import React from 'react';

import './HomeSkeleton.css';

function SkeletonElement({ type }) {
	return <div className={`skeleton ${type}`}></div>;
}

export function UserProjectsSkeleton() {
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
