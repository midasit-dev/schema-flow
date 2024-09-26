import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowID } from '../RecoilAtom/recoilReactFlowState';
import { UpdateTime } from './Recents';

// css
import './Recents.css';

// recoil
import { useSetRecoilState } from 'recoil';

async function fetchTemplate() {
	const response = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`);
	if (response.ok) {
		const data = await response.json();
		console.log('Template:', data);
		return data;
	}
	return [];
}

export default function Template({ width, handleLoading }) {
	const navigate = useNavigate();
	const [templateList, setTemplateList] = React.useState([]);
	const setFlowID = useSetRecoilState(FlowID);

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
		if (templateList.length > 0) handleLoading(false);
	}, [templateList, handleLoading]);

	function onClickTemplate(templateId) {
		setFlowID(templateId);
		navigate(`../flow/${templateId}`);
	}

	return (
		<>
			{templateList &&
				templateList.length !== 0 &&
				templateList.map((template) => {
					let url = 'https://moa.rpm.kr-dv-midasit.com/rpm-wgsd-thumbnail/image.png';
					if (template.thumbnailFileUrl) {
						url = template.thumbnailFileUrl;
					}
					return (
						<div
							key={template.templateId}
							style={{
								width: `calc(${width}px - 40px)`,
								height: width,
								display: 'flex',
								justifyContent: 'cetner',
								flexDirection: 'column',
								borderRadius: '10px',
								cursor: 'pointer',
							}}
							onClick={() => onClickTemplate(template.templateId)}
						>
							<div className='recents-thumbnail'>
								<img src={url} alt='Thumbnail' style={{ width: '100%', height: '100%' }} />
							</div>
							<div className='recents-title'>{template.title}</div>
							<UpdateTime>{template.updatedAt}</UpdateTime>
						</div>
					);
				})}
		</>
	);
}
