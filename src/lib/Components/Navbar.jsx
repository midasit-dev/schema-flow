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
import { IsSessionValid, GetToken } from '../Common/Login/SessionChecker';
import { fetchFunction } from '../Common/fetch';

const imageWidth = 1024;
const imageHeight = 768;

async function uploadImageToServer(blob, token, flowId) {
	const formData = new FormData();
	formData.append('file', blob, 'Thumbnail.png');
	const res = await fetchFunction({
		baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/thumbnail/${flowId}`,
		method: 'POST',
		body: formData,
		tokenHeaderKey: 'Authorization',
		token: token,
	});

	if (res && res.ok) {
		const data = await res.json();
		console.log('Thumbnail Save %cSuccessed%c:', 'color: green; font-weight: bold;', '', data);
	} else {
		console.error('Thumbnail Save %cFailed%c:', 'color: red; font-weight: bold;', '', res);
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

	const onSaveThumbnail = async (token) => {
		const startTime = performance.now();
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
		const endTime = performance.now();
		console.log(`Blob creation took ${endTime - startTime} milliseconds`);
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
		let newToken = '';
		const isValid = await IsSessionValid(token);
		if (!isValid || isValid === 'token is empty') {
			console.log('token is invalid');
			const newTokenResult = await GetToken(acc);
			if (newTokenResult === 'acc is empty' || newTokenResult === 'token issuance failed') {
				console.error(newTokenResult);
				return null;
			} else {
				setToken(newTokenResult);
				newToken = newTokenResult;
			}
		} else newToken = token;

		await onSaveThumbnail(newToken);

		let flowDatas = localStorage.getItem(flowId);
		if (typeof flowDatas === 'string') {
			flowDatas = JSON.parse(flowDatas);
		}
		const body = {
			title: title,
			flowData: flowDatas,
		};
		const res = await fetchFunction({
			baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/${flowId}`,
			method: 'PUT',
			body: body,
			tokenHeaderKey: 'Authorization',
			token: newToken,
		});
		if (res && res.ok)
			console.log('All data save %csuccessed%c:', 'color: green; font-weight: bold;', '', res);
		else console.error('All data save %cfailed%c:', 'color: red; font-weight: bold;', '', res);
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
