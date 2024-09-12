import React from 'react';

async function fetchTemplate() {
	const response = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`);
	const data = await response.json();
	return data;
}

export default function Template({ width, handleLoading }) {
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

	React.useEffect(() => {
		if(templateList.length > 0) handleLoading(false);
	}, [templateList, handleLoading]);

	return (
		<>
			{templateList.map((template, index) => {
				let url = 'https://moa.rpm.kr-dv-midasit.com/rpm-wgsd-thumbnail/image.png';
				if (template.thumbnailFileUrl) {
					url = template.thumbnailFileUrl;
				}
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
								overflow: 'hidden',
							}}
						>
							<img src={url} alt='Thumbnail' style={{ width: '100%', height: '100%' }} />
						</div>
						<h2>{template.title}</h2>
						<p>{template.updatedAt}</p>
					</div>
				);
			})}
		</>
	);
}
