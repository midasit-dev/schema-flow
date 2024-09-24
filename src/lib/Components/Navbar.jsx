import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toBlob } from 'html-to-image';
import rss from 'react-secure-storage';
import { SvgSave, SvgHome, SvgEdit } from './SVGComps';

// recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { FlowID } from '../RecoilAtom/recoilReactFlowState';
import { TokenState, AccState } from '../RecoilAtom/recoilHomeState';

// css
import './Navbar.css';
import { GetToken } from '../Common/Login/SessionChecker';

const imageWidth = 1024;
const imageHeight = 768;

async function putFlowDatas(body, token, flowId) {
	const res = await fetch(
		`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/${flowId}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		},
	);
	if (res.ok) {
		const data = await res.json();
		return data;
	}
	return null;
}

async function uploadImageToServer(blob, token, flowId) {
	const formData = new FormData();
	formData.append('file', blob, 'Thumbnail.png');

	await fetch(
		`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/thumbnail/${flowId}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		},
	)
		.then((response) => response.json())
		.then((data) => {
			console.log('Server response:', data);
		})
		.catch((error) => {
			console.error('Error uploading image:', error);
		});
}

export default function Navbar({ title }) {
	const [isMouseHoverEdit, setIsMouseHoverEdit] = React.useState(false);

	const { getNodes } = useReactFlow();
	const [token, setToken] = useRecoilState(TokenState);
	const [acc, setAcc] = useRecoilState(AccState);
	const flowId = useRecoilValue(FlowID);
	const navigate = useNavigate();

	const onSaveThumbnail = async () => {
		const nodesBounds = getNodesBounds(getNodes());

		const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

		toBlob(document.querySelector('.react-flow__viewport'), {
			backgroundColor: '#FFF',
			width: viewport.width,
			height: viewport.height,
			style: {
				width: imageWidth,
				height: imageHeight,
				transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
			},
			useCors: true,
		}).then(async (blob) => {
			if (blob) {
				await uploadImageToServer(blob, token, flowId);
			} else {
				console.error('Blob creation failed');
			}
		});
	};

	const saveAllData = async () => {
		const result = await GetToken(token, setToken, acc, setAcc);
		if (result === 'acc is empty') return;
		await onSaveThumbnail();
		const flowDatas = rss.getItem(flowId);
		const body = {
			title: title,
			flowData: flowDatas,
		};
		const res = await putFlowDatas(body, token, flowId);
		console.log('res:', res);
	};

	const onClickSave = async () => {
		await saveAllData();
	};

	const onClickHome = async () => {
		await saveAllData();
		navigate('../home');
	};

	return (
		<div className='navbar'>
			<div style={{ width: '20%', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
				<div className='navbar-side-icon' onClick={onClickHome}>
					<SvgHome />
				</div>
			</div>
			<div
				style={{
					width: '60%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: '20px',
					fontFamily: 'pretendard medium',
				}}
			>
				<div style={{ marginRight: '5px' }}>{title}</div>
				<div
					className='navbar-title-edit-icon'
					onMouseEnter={() => setIsMouseHoverEdit(true)}
					onMouseLeave={() => setIsMouseHoverEdit(false)}
				>
					<SvgEdit isHovered={isMouseHoverEdit} />
				</div>
			</div>
			<div style={{ width: '20%', display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
				<div className='navbar-side-icon' onClick={onClickSave}>
					<SvgSave />
				</div>
			</div>
		</div>
	);
}
