import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toBlob } from 'html-to-image';
import { SvgSave, SvgHome, SvgEdit } from './SVGComps';
import { motion } from 'framer-motion';

// recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { FlowID } from '../RecoilAtom/recoilReactFlowState';
import { TokenState, AccState } from '../RecoilAtom/recoilHomeState';

// css
import './Navbar.css';

// common
import { GetToken } from '../Common/Login/SessionChecker';
import { fetchFunction } from '../Common/fetch';

const imageWidth = 1024;
const imageHeight = 768;

async function uploadImageToServer(blob, token, flowId) {
	console.log('blob:', blob);
	const formData = new FormData();
	formData.append('file', blob, 'Thumbnail.png');
	console.log('formData:', formData);
	console.log('formData type', typeof formData);
	const res = await fetchFunction({
		baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/thumbnail/${flowId}`,
		method: 'POST',
		body: formData,
		tokenHeaderKey: 'Authorization',
		token: token,
	});

	if (res.ok) {
		const data = await res.json();
		console.log('Thumbnail Save Successed:', data);
	} else {
		console.error('Thumbnail Save Failed:', res);
	}
}

export default function Navbar({ title, setTitle }) {
	const [isMouseHoverEdit, setIsMouseHoverEdit] = React.useState(false);
	const [istitleEditMode, setIsTitleEditMode] = React.useState(false);

	const { getNodes } = useReactFlow();
	const [token, setToken] = useRecoilState(TokenState);
	const [acc, setAcc] = useRecoilState(AccState);
	const flowId = useRecoilValue(FlowID);
	const navigate = useNavigate();

	const onSaveThumbnail = async () => {
		const nodesBounds = getNodesBounds(getNodes());

		const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

		const blob = await toBlob(document.querySelector('.react-flow__viewport'), {
			backgroundColor: '#FFF',
			width: viewport.width,
			height: viewport.height,
			style: {
				width: imageWidth,
				height: imageHeight,
				transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
			},
			useCors: true,
		});
		if (blob) {
			await uploadImageToServer(blob, token, flowId);
		} else {
			console.error('Blob creation failed');
		}
	};

	const saveChangedTitle = async () => {
		const body = {
			title: title,
		};
		const res = await fetchFunction({
			baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/${flowId}`,
			method: 'PUT',
			body: body,
			tokenHeaderKey: 'Authorization',
			token: token,
		});
		if (res.ok) console.log('title save successed:', res);
		else console.error('title save failed:', res);
	};

	const saveAllData = async () => {
		const result = await GetToken(token, setToken, acc, setAcc);
		if (result === 'acc is empty') return;
		await onSaveThumbnail();
		let flowDatas = localStorage.getItem(flowId);
		if (typeof flowDatas === 'string') {
			flowDatas = JSON.parse(flowDatas);
		}
		const body = {
			title: title,
			flowData: flowDatas,
		};
		console.log('body:', body);
		const res = await fetchFunction({
			baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/${flowId}`,
			method: 'PUT',
			body: body,
			tokenHeaderKey: 'Authorization',
			token: token,
		});
		if (res.ok) console.log('All data save successed:', res);
		else console.error('All data save failed:', res);
	};

	const onClickSave = async () => {
		await saveAllData();
	};

	const onClickHome = async () => {
		await saveAllData();
		navigate('../home');
	};

	const onClickEdit = () => {
		setIsTitleEditMode(true);
		setIsMouseHoverEdit(false);
	};

	const onBlurTitleEdit = (e) => {
		saveChangedTitle(e.target.value);
		setIsTitleEditMode(false);
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
				{istitleEditMode ? (
					<input
						className='navbar-title-edit-input'
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={onBlurTitleEdit}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setIsTitleEditMode(false);
								saveChangedTitle(e.target.value);
							}
						}}
						autoFocus
					/>
				) : (
					<>
						{title !== '' && (
							<>
								<motion.div
									initial={{ opacity: 0, y: '-50%' }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									style={{ marginRight: '5px' }}
								>
									{title}
								</motion.div>
								<div
									className='navbar-title-edit-icon'
									onMouseEnter={() => setIsMouseHoverEdit(true)}
									onMouseLeave={() => setIsMouseHoverEdit(false)}
									onClick={onClickEdit}
								>
									<SvgEdit isHovered={isMouseHoverEdit} />
								</div>
							</>
						)}
					</>
				)}
			</div>
			<div style={{ width: '20%', display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
				<div className='navbar-side-icon' onClick={onClickSave}>
					<SvgSave />
				</div>
			</div>
		</div>
	);
}
