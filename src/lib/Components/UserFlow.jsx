import React from 'react';

import { UserFlowTemplateSkeleton } from './Skeleton/HomeSkeleton';

import './UserFlow.css';

export default function UserFlow() {
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}, []);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
			{isLoading ? <UserFlowTemplateSkeleton /> : <div>Flow</div>}
		</div>
	);
}
