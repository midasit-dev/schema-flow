import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId } from '../../RecoilAtom/recoilState';

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
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [changedData, setChangedData] = React.useState({ formData: {} });

	React.useEffect(() => {
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].target === nodeId && edgesInfo[i].source !== null) {
					setIsDisabled(true);
					break;
				} else setIsDisabled(false);
			}
		} else setIsDisabled(false);
	}, [edgesInfo]);

	React.useEffect(() => {
		if (executeNodeId.length > 0) {
			for (let i = 0; i < executeNodeId.length; i++) {
				if (executeNodeId[i] === nodeId) {
					AutomaticRun();
					setExecuteNodeId((prev) => {
						return prev.filter((item) => item !== nodeId);
					});
				}
			}
		}
	}, [executeNodeId]);

	const setNextExecuteNodeId = React.useCallback(() => {
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].source === nodeId) {
					const targetNodeId = edgesInfo[i].target;
					setExecuteNodeId((prev) => {
						return [...prev, targetNodeId]; 
					});
				}
			}
		}
	}, [edgesInfo, nodeId, setExecuteNodeId]);

	const AutomaticRun = React.useCallback(async () => {
		setIsloading(true);
		await postFunctionExecute(path, changedData.formData, enqueueSnackbar, setResponseData);
		setIsloading(false);
		setNextExecuteNodeId();
	}, [path, changedData, enqueueSnackbar, setResponseData, setIsloading, setNextExecuteNodeId]);
	
	const onChangedData = React.useCallback((data) => {
		setChangedData((prevState) => {
			const newFormData = data.formData;
			const prevFormData = prevState.formData;
	
			// 필드별로 변경 여부 확인
			if (JSON.stringify(prevFormData) !== JSON.stringify(newFormData)) {
				return { ...prevState, formData: newFormData };
			}
			return prevState;
		});
	}, [setChangedData]);

	async function onClickedRunButton(data) {
		setIsloading(true);
		await postFunctionExecute(path, data.formData, enqueueSnackbar, setResponseData);
		setIsloading(false);
		setNextExecuteNodeId();
	}

	function onErrored(event) {
		console.log('error', event);
	}

	return (
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
					// when disabled is true, background color is gray
					backgroundColor: isDisabled ? 'gray' : 'rgba(0, 71, 171, 0.7)',
				}}
				disabled={isDisabled}
			>
				Run
			</button>
		</Form>
	);
}
