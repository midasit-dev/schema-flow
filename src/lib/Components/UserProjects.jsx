import React from 'react';

import { navContentList } from '../Common/string';

// components
import Template from './Template';
import Recents from './Recents';
import { UserProjectsSkeleton } from './Skeleton/HomeSkeleton';

// css
import './UserProjects.css';

export default function UserProjects({ navContent }) {
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		
	})

	React.useEffect(() => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}, [navContent]);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
			{isLoading ? (
				<UserProjectsSkeleton />
			) : (
				<div>
					{navContent === navContentList.recents && <Recents />}
					{navContent === navContentList.template && <Template />}
				</div>
			)}
		</div>
	);
}
