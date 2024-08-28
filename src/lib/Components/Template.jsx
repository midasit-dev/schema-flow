import React from 'react';

async function fetchTemplate() {
	const response = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`);
	const data = await response.json();
	return data;
}

export default function Template() {
	React.useEffect(() => {
		async function getTemplateList() {
			const templateList = await fetchTemplate();
			if (!ignore) {
				console.log(templateList);
			}
		}

		let ignore = false;
		getTemplateList();
		return () => {
			ignore = true;
		};
	}, []);

	return <div></div>;
}
