import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId, ExecuteState } from '../../RecoilAtom/recoilState';

async function postFunctionExecute(path, body, enqueueSnackbar) {
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
		return data;
	} else {
		enqueueSnackbar('Error', { variant: 'error' });
		return {};
	}
}

export default function RJSFComp(props) {
	const { nodeId, schema, path, enqueueSnackbar, setResponseData, setIsloading } = props;

	const edgesInfo = useRecoilValue(EgdesInfo);
	const [executeNodeId, setExecuteNodeId] = useRecoilState(ExecuteNodeId);
	const [executeState, setExecuteState] = useRecoilState(ExecuteState);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [changedData, setChangedData] = React.useState({ formData: {} });
	const [preFunctionIds, setPreFunctionIds] = React.useState([]);
	const [postFunctionIds, setPostFunctionIds] = React.useState([]);
	const [isExecuted, setIsExecuted] = React.useState(false);

	React.useEffect(() => {
		console.log('RJSFComp id', nodeId);
		console.log('preFunctionIds', preFunctionIds);
		console.log('postFunctionIds', postFunctionIds);
	}, [preFunctionIds, postFunctionIds]);

	React.useEffect(() => {
		console.log('nodeId', nodeId);
		console.log('executeState', executeState);
		if (executeState[nodeId]) {
			setPreExecuteNodeId();
		}
	}, [executeState]);

	React.useEffect(() => {
		// executeNodeId 배열에 nodeId가 있을 때 실행
		async function run() {
			if (executeNodeId.length > 0) {
				console.log('executeNodeId', executeNodeId);
				if (executeNodeId.includes(nodeId) && isExecuted === false) {
					console.log('run function that ' + nodeId);
					console.log('isExecuted', isExecuted);
					console.log('executeState', executeState);
					await runFunctionFromServer();
				}
			}
		}
		run();
	}, [executeNodeId]);

	React.useEffect(() => {
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].source === nodeId) {
					const targetNodeId = edgesInfo[i].target;
					setPostFunctionIds((prev) => {
						if (prev.includes(targetNodeId)) return prev;
						return [...prev, targetNodeId];
					});
				} else if (edgesInfo[i].target === nodeId) {
					const sourceNodeId = edgesInfo[i].source;
					setPreFunctionIds((prev) => {
						if (prev.includes(sourceNodeId)) return prev;
						return [...prev, sourceNodeId];
					});
				}
			}
		}
	}, [edgesInfo]);

	// 공통 함수
	const checkAllPreFunctionIsExecuted = React.useCallback(
		(preFunctionIds) => {
			for (let preFunctionId of preFunctionIds) {
				if (executeState[preFunctionId]) {
					if (executeState[preFunctionId].isExecuted === false) {
						return false;
					}
				} else return false;
			}
			return true;
		},
		[executeState],
	);

	const setPreExecuteNodeId = React.useCallback(() => {
		// 선행되어야할 함수가 있을 때
		if (preFunctionIds.length > 0) {
			const isAllExecuted = checkAllPreFunctionIsExecuted(preFunctionIds);
			// 선행되어야할 함수가 모두 실행되었을 때
			if (isAllExecuted && isExecuted === false) {
				console.log('isAllExecuted', isAllExecuted);
				setExecuteNodeId((prev) => {
					if (prev.includes(nodeId)) return prev;
					return [...prev, nodeId];
				});
			} else {
				for (let preFunctionId of preFunctionIds) {
					setExecuteState((prev) => {
						const preNode = prev[preFunctionId];
						if (preNode) return prev;
						return { ...prev, [preFunctionId]: { isExecuted: false, output: {} } };
					});
				}
			}
		}
		// 선행되어야할 함수가 없을 때
		else {
			if (isExecuted === false) {
				console.log('first node that ' + nodeId);
				setExecuteNodeId((prev) => {
					if (prev.includes(nodeId)) return prev;
					return [...prev, nodeId];
				});
			}
		}
	}, [preFunctionIds, checkAllPreFunctionIsExecuted]);

	const setPostExecuteNodeId = React.useCallback(() => {
		if (postFunctionIds.length > 0) {
			for (let i = 0; i < postFunctionIds.length; i++) {}
		}
	}, [postFunctionIds]);

	const checkPrePostFunction = React.useCallback(async () => {
		setPreExecuteNodeId();
		// setPostExecuteNodeId();
	}, [setPreExecuteNodeId, setPostExecuteNodeId]);

	async function runFunctionFromServer() {
		setIsloading(true);
		setIsExecuted(true);
		const responseData = await postFunctionExecute(
			path,
			changedData.formData,
			enqueueSnackbar,
			setResponseData,
			setIsExecuted,
		);
		setResponseData(responseData);
		setExecuteState((prev) => {
			return { ...prev, [nodeId]: { isExecuted: true, output: responseData } };
		});
		setExecuteNodeId((prev) => {
			return prev.filter((item) => item !== nodeId);
		});
		setIsloading(false);
	}

	// Run 버튼을 눌렀을때, 필요 로직
	async function onClickedRunButton() {
		console.log("clicked run button");
		console.log("nodeId", nodeId);
		setExecuteState({ [nodeId]: { isExecuted: false, output: {} } });
		await checkPrePostFunction();
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
