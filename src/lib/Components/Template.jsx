import React from 'react';

async function fetchTemplate() {
	const response = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`);
	const data = await response.json();
	return data;
}

export default function Template({ width, src }) {
	const [templateList, setTemplateList] = React.useState([]);

	React.useEffect(() => {
		async function getTemplateList() {
			const templatelist = await fetchTemplate();
			if (!ignore) {
				setTemplateList(templatelist);
			}
		}

		let ignore = false;
		getTemplateList();
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<>
			{templateList.map((template) => {
				return (
					<div
						key={template.templateId}
						style={{
							width,
							height: width,
							display: 'flex',
							justifyContent: 'cetner',
							flexDirection: 'column',
							borderRadius: '10px',
							cursor: 'pointer',
						}}
					>
						<div
							style={{
								width,
								height: width,
								borderRadius: '10px',
								border: '1px solid #e6e6e6',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<img
								src={'./reactflow.png'}
								alt='Thumbnail'
								style={{ maxWidth: '100%', height: 'auto' }}
							/>
						</div>
						<h2>{template.title}</h2>
						<p>{template.updatedAt}</p>
					</div>
				);
			})}
		</>
	);
}
