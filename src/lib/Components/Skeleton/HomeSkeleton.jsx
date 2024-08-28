import React from 'react';

function SkeletonElement({ type }) {
	return <div className={`skeleton ${type}`}></div>;
}

export function UserFlowTemplateSkeleton() {
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