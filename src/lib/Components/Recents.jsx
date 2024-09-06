import React from 'react';
import { useNavigate } from 'react-router-dom';

// recoil
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { TokenState } from '../RecoilAtom/recoilHomeState';
import { FlowID } from '../RecoilAtom/recoilReactFlowState';

// components
import { SvgPlus } from './SVGComps';

// css
import './Recents.css';
import TemplatesFunctionalComponentsDataGridWithClipboardOption from '@midasit-dev/moaui-components-v1/Templates/FunctionalComponents/Code/DataGridWithClipboard.code.except';

async function postNewFlowProject(token) {
	const res = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title: 'Untitled',
		}),
	});

	if (res.ok) {
		const data = await res.json();
		return data;
	}
	return null;
}

function NewFlowProject({ width }) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<div
			className='recents-container'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width, height: width }}
		>
			<div className='recents-inner'>
				<div className='recents-icon-container'>
					<SvgPlus isHovered={isHovered} />
				</div>
				<div className='recents-text'>New Flow Project</div>
			</div>
		</div>
	);
}

export default function Recents(props) {
	const { width = '200px' } = props;
	const token = useRecoilValue(TokenState);
 	const setFlowID = useSetRecoilState(FlowID);
	
	const navigate = useNavigate();

	const onClickNewFlow = async () => {
		const response = await postNewFlowProject(token);
		if(response === null) {
			console.error('Failed to create new flow project');
			return;
		}
		const flowId = response.fileId;
		if(flowId){
			setFlowID(flowId);
			navigate(`../Flow/${flowId}`);
		}
	};

	return (
		<div onClick={onClickNewFlow}>
			<NewFlowProject width={width} />
		</div>
	);
}
