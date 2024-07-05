import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId, ExecuteState } from '../../RecoilAtom/recoilState';

async function postFunctionExecute(path, body, enqueueSnackbar, setResponseData) {
	// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
	const res = await fetch(
		`${process.env.REACT_APP_API_URL}backend/function-executor/python-execute/${path}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	if (res.ok) {
		enqueueSnackbar('Success', { variant: 'success' });
		const data = await res.json();
		console.log('data', data);
		setResponseData(data);
	}
}

export default function RJSFComp(props) {
	const { nodeId, schema, path, enqueueSnackbar, setResponseData, setIsloading } = props;

	const edgesInfo = useRecoilValue(EgdesInfo);
	const [executeNodeId, setExecuteNodeId] = useRecoilState(ExecuteNodeId);
	const [executeState, setExecuteState] = useRecoilState(ExecuteState);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [changedData, setChangedData] = React.useState({ formData: {} });
	const [preFunctionId, setPreFunctionId] = React.useState([]);
	const [postFunctionId, setPostFunctionId] = React.useState([]);
	const [isRun, setIsRun] = React.useState(false);

	React.useEffect(() => {
		console.log('RJSFComp id', nodeId);
		console.log('preFunctionId', preFunctionId);
		console.log('postFunctionId', postFunctionId);
	}, [preFunctionId, postFunctionId]);

	React.useEffect(() => {
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].source === nodeId) {
					const targetNodeId = edgesInfo[i].target;
					setPostFunctionId((prev) => {
						if (prev.includes(targetNodeId)) return prev;
						return [...prev, targetNodeId];
					});
				} else if (edgesInfo[i].target === nodeId) {
					const sourceNodeId = edgesInfo[i].source;
					setPreFunctionId((prev) => {
						if (prev.includes(sourceNodeId)) return prev;
						return [...prev, sourceNodeId];
					});
				}
			}
		}
	}, [edgesInfo]);

	// 공통 함수
	const setPreExecuteNodeId = React.useCallback(() => {
		if (preFunctionId.length > 0) {
			for (let preNodeId in preFunctionId) {
				console.log('preNodeId', preNodeId);
			}
		}
	}, [preFunctionId]);

	const setPostExecuteNodeId = React.useCallback(() => {
		if (postFunctionId.length > 0) {
			for (let i = 0; i < postFunctionId.length; i++) {
			}
		}
	}, [postFunctionId]);

	const checkPrePostFunction = React.useCallback(async () => {
		console.log("checkPrePostFunction");
		setPreExecuteNodeId();
		setPostExecuteNodeId();
	}, [setPreExecuteNodeId, setPostExecuteNodeId]);

	async function runFunction2API() {
		setIsloading(true);
		setExecuteState((prev) => {
			const newState = { ...prev, nodeId: true };
			return newState;
		});
		setIsRun(true);
		await postFunctionExecute(
			path,
			changedData.formData,
			enqueueSnackbar,
			setResponseData,
			setIsRun,
		);
		setIsloading(false);
	}

	// Run 버튼을 눌렀을때, 필요 로직
	async function onClickedRunButton(data) {
		await checkPrePostFunction();
	}

	// 연결 관계에 의해 실행될 때, 필요 로직
	React.useEffect(() => {
		if (executeNodeId.length > 0) {
			console.log('executeNodeId', executeNodeId);
			executePreFunction();
			executePostFunction();
		}
	}, [executeNodeId]);

	async function executePreFunction() {
		for (let i = 0; i < executeNodeId.length; i++) {
			if (executeNodeId[i] === nodeId) {
				// 선행되어야할 함수가 없다면 바로 실행
				if (preFunctionId.length === 0) {
					await checkPrePostFunction();
					setExecuteNodeId((prev) => {
						return prev.filter((item) => item !== nodeId);
					});
				} else {
					// 선행되어야할 함수가 있다면 선행되어야할 함수를 등록하고 자신은 제거.
					setExecuteNodeId((prev) => {
						const executeNodes = prev.filter((item) => item !== nodeId);
						return [...executeNodes, ...preFunctionId];
					});
				}
			}
		}
	}

	async function executePostFunction() {
		for (let i = 0; i < executeNodeId.length; i++) {
			if (executeNodeId[i] === nodeId) {
				await checkPrePostFunction();
			}
		}
	}

	const onChangedData = React.useCallback(
		(data) => {
			setChangedData((prevState) => {
				const newFormData = data.formData;
				const prevFormData = prevState.formData;

				// 필드별로 변경 여부 확인
				if (JSON.stringify(prevFormData) !== JSON.stringify(newFormData)) {
					return { ...prevState, formData: newFormData };
				}
				return prevState;
			});
		},
		[setChangedData],
	);

	function onErrored(event) {
		console.log('error', event);
	}

	return (
		<div style={{ paddingRight: '10px' }}>
			<Form
				schema={schema}
				validator={validator}
				formData={changedData.formData}
				onChange={onChangedData}
				onSubmit={onClickedRunButton}
				onError={onErrored}
			>
				<button
					type='submit'
					className='btn'
					style={{
						width: '100%',
						position: 'fixed',
						bottom: 0,
						left: 0,
						height: '30px',
						padding: 0,
						margin: 0,
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
						border: '1px solid #c1c1c3',
						color: 'white',
						fontSize: '16px',
						fontWeight: 'bold',
						fontFamily: 'pretendard',
						fontStretch: 'normal',
						backgroundColor: 'rgba(0, 71, 171, 0.7)',
					}}
					disabled={isDisabled}
				>
					Run
				</button>
			</Form>
		</div>
	);
}
