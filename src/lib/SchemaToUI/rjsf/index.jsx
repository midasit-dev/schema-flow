import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId, ExecuteFlow, ExecuteState } from '../../RecoilAtom/recoilState';
import { isEmpty } from 'lodash';
import './index.css';

async function postFunctionExecuteToST(path, body, enqueueSnackbar, isSuccessFunctionExecute) {
	// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
	const res = await fetch(
		`${process.env.REACT_APP_ACTUAL_ST_API_URL}backend/function-executor/python-execute/${path}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	if (res.ok) {
		isSuccessFunctionExecute(true);
		const data = await res.json();
		console.log('data', data);
		return data;
	} else {
		isSuccessFunctionExecute(false);
		return {};
	}
}

function updateDefaults(inputSchema, outputSchema) {
	for (const key in outputSchema) {
		if (inputSchema.properties.hasOwnProperty(key)) {
			// Update default values for matching keys
			if (outputSchema[key] !== null) inputSchema.properties[key].default = outputSchema[key];

			// Recursively update nested properties if necessary
			if (
				typeof outputSchema[key] === 'object' &&
				!Array.isArray(outputSchema[key]) &&
				inputSchema.properties[key].properties
			) {
				updateDefaults(inputSchema.properties[key], outputSchema[key]);
			}
		}
	}
	return inputSchema;
}

export default function RJSFComp(props) {
	const {
		nodeId,
		schema,
		path,
		enqueueSnackbar,
		setResponseData,
		setIsloading,
		isSuccessFunctionExecute,
	} = props;

	const edgesInfo = useRecoilValue(EgdesInfo);
	const [executeNodeId, setExecuteNodeId] = useRecoilState(ExecuteNodeId);
	const [executeFlow, setExecuteFlow] = useRecoilState(ExecuteFlow);
	const [executeState, setExecuteState] = useRecoilState(ExecuteState);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [changedData, setChangedData] = React.useState({ formData: {} });
	const [preFunctionIds, setPreFunctionIds] = React.useState([]);
	const [postFunctionIds, setPostFunctionIds] = React.useState([]);
	const [formSchema, setFormSchema] = React.useState(schema);
	const [isSingleRunClicked, setIsSingleRunClicked] = React.useState(false);
	const [isFlowRunClicked, setIsFlowRunClicked] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);
	const [execute, setExecute] = React.useState(false);

	React.useEffect(() => {
		setExecuteState((prev) => {
			// prev example
			// {
			// 	"nodeId": {
			// 		'setExecute': setExecute,
			// 		'setIsOpenJsonView': setIsOpenJsonView,
			// 		'setIsSuccess': setIsSuccess,
			// 		'setIsError': setIsError
			// 	}
			// };
			return { ...prev, [nodeId]: { ...prev[nodeId], setExecute } };
		});
	}, []);

	React.useEffect(() => {
		// const functionExecute = executeState[nodeId];
		// if (functionExecute) {
		// 	functionExecute(true);
		// }
	}, [executeState]);

	React.useEffect(() => {
		async function run() {
			if (execute) {
				syncPreOutput2InputSchema();
				await runFunctionFromServer();
			}
		}
		run();
	}, [execute]);

	React.useEffect(() => {
		if (isSingleRunClicked) {
			setExecuteNodeId((prev) => {
				if (prev.includes(nodeId)) return prev;
				return [...prev, nodeId];
			});
		} else if (executeFlow[nodeId] && isSingleRunClicked === false) {
			setPreExecuteNodeId();
		}
	}, [executeFlow]);

	React.useEffect(() => {
		// executeNodeId 배열에 nodeId가 있을 때 실행
		async function run() {
			if (executeNodeId.length > 0) {
				if (executeNodeId.includes(nodeId) && executeFlow[nodeId]) {
					if (executeFlow[nodeId].isExecuted === false) {
						executeState[nodeId]['setExecute'](true);
					}
				} else if (executeNodeId.includes(nodeId) && isSingleRunClicked) {
					await runFunctionFromServer();
				}
			}
		}
		run();
	}, [executeNodeId]);

	React.useEffect(() => {
		let isConnectedEdge = false;
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].source === nodeId) {
					isConnectedEdge = false;
					const targetNodeId = edgesInfo[i].target;
					setPostFunctionIds((prev) => {
						if (prev.includes(targetNodeId)) return prev;
						return [...prev, targetNodeId];
					});
				} else if (edgesInfo[i].target === nodeId) {
					isConnectedEdge = true;
					const sourceNodeId = edgesInfo[i].source;
					setPreFunctionIds((prev) => {
						if (prev.includes(sourceNodeId)) return prev;
						return [...prev, sourceNodeId];
					});
				}
			}
		}
		setIsConnected(isConnectedEdge);
	}, [edgesInfo]);

	// 공통 함수
	const syncPreOutput2InputSchema = React.useCallback(() => {
		if (preFunctionIds.length > 0) {
			for (let preFunctionId of preFunctionIds) {
				if (executeFlow[preFunctionId]) {
					const output = executeFlow[preFunctionId].output;
					if (output && isEmpty(output) === false) {
						const result = output.json;
						const resultKeys = Object.keys(result);
						for (let resultkey of resultKeys) {
							const dataClass = resultkey;
							const schemaKeys = Object.keys(schema.properties);
							for (let schemaKey of schemaKeys) {
								if (schema.properties[schemaKey].dataclassname === dataClass) {
									updateDefaults(schema.properties[schemaKey], result[resultkey]);
									setFormSchema(schema);
								}

								if (changedData.formData[schemaKey]) {
									for (const key in result[resultkey]) {
										if (result[resultkey][key] !== null) {
											changedData.formData[schemaKey][key] = result[resultkey][key];
										}
									}
								}
							}
						}
					} else {
						console.log('output is empty');
					}
				}
			}
		}
		return;
	}, [executeFlow, preFunctionIds, schema, changedData]);

	const checkAllPreFunctionIsExecuted = React.useCallback(
		(preFunctionIds) => {
			for (let preFunctionId of preFunctionIds) {
				if (executeFlow[preFunctionId]) {
					if (executeFlow[preFunctionId].isExecuted === false) {
						return false;
					}
				} else return false;
			}
			return true;
		},
		[executeFlow],
	);

	const initExecuteState = React.useCallback(() => {
		if (Object.keys(executeState).length > 0) {
			for (let key in executeState) {
				if (executeState[key]) {
					executeState[key]['setExecute'](false);
					executeState[key]['setIsOpenJsonView'](false);
					executeState[key]['setIsSuccess'](false);
					executeState[key]['setIsError'](false);
				}
			}
		}
	}, [executeState]);

	const setPreExecuteNodeId = React.useCallback(() => {
		// 선행되어야할 함수가 있을 때
		if (preFunctionIds.length > 0) {
			const isAllExecuted = checkAllPreFunctionIsExecuted(preFunctionIds);
			// 선행되어야할 함수가 모두 실행되었을 때
			if (isAllExecuted) {
				if (executeFlow[nodeId]) {
					if (executeFlow[nodeId].isExecuted) {
						return;
					}
				}
				setExecuteFlow((prev) => {
					if (prev[nodeId]) return prev;
					return { ...prev, [nodeId]: { isExecuted: false, output: {} } };
				});
				setExecuteNodeId((prev) => {
					if (prev.includes(nodeId)) return prev;
					return [...prev, nodeId];
				});
			} else {
				for (let preFunctionId of preFunctionIds) {
					setExecuteFlow((prev) => {
						const preNode = prev[preFunctionId];
						if (preNode) return prev;
						return { ...prev, [preFunctionId]: { isExecuted: false, output: {} } };
					});
				}
			}
		}
		// 선행되어야할 함수가 없을 때
		else {
			if (executeFlow[nodeId]) {
				if (executeFlow[nodeId].isExecuted) {
					return;
				}
			}
			setExecuteFlow((prev) => {
				if (prev[nodeId]) return prev;
				return { ...prev, [nodeId]: { isExecuted: false, output: {} } };
			});
			setExecuteNodeId((prev) => {
				if (prev.includes(nodeId)) return prev;
				return [...prev, nodeId];
			});
		}
	}, [
		preFunctionIds,
		checkAllPreFunctionIsExecuted,
		nodeId,
		setExecuteNodeId,
		setExecuteFlow,
		executeFlow,
		executeState,
	]);

	const setPostExecuteNodeId = React.useCallback(() => {
		if (postFunctionIds.length > 0) {
			for (let i = 0; i < postFunctionIds.length; i++) {}
		}
	}, [postFunctionIds]);

	const checkPrePostFunction = React.useCallback(async () => {
		setPreExecuteNodeId();
		// setPostExecuteNodeId();
	}, [setPreExecuteNodeId]);

	async function runFunctionFromServer() {
		setIsloading(true);
		let responseData = {};
		try {
			responseData = await postFunctionExecuteToST(
				path,
				changedData.formData,
				enqueueSnackbar,
				isSuccessFunctionExecute,
			);
		} catch {
			setIsloading(false);
			isSuccessFunctionExecute(false);
			return;
		}
		setResponseData(responseData);
		setExecuteFlow((prev) => {
			return { ...prev, [nodeId]: { isExecuted: true, output: responseData } };
		});
		setExecuteNodeId((prev) => {
			return prev.filter((item) => item !== nodeId);
		});
		setIsloading(false);
	}

	// Run 버튼을 눌렀을때, 필요 로직
	async function onClickedFlowRunButton() {
		initExecuteState();
		setExecuteFlow((prev) => {
			return { [nodeId]: { isExecuted: false, output: {} } };
		});
	}

	async function onClickedSingleRunButton() {
		initExecuteState();
		setExecuteFlow({ [nodeId]: { isExecuted: false, output: {} } });
	}

	async function onSubmit() {
		if (isSingleRunClicked) {
			await onClickedSingleRunButton();
			setIsSingleRunClicked(false);
		} else if (isFlowRunClicked) {
			await onClickedFlowRunButton();
			setIsFlowRunClicked(false);
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
			// chagne schema default value when form data is changed
			setFormSchema((prev) => {
				const newSchema = { ...prev };
				for (const key in newSchema.properties) {
					if (data.formData[key]) {
						updateDefaults(newSchema.properties[key], data.formData[key]);
					}
				}
				return newSchema;
			});
		},
		[setChangedData, setFormSchema],
	);

	function onErrored(event) {
		console.log('error', event);
	}

	return (
		<div style={{ paddingRight: '10px' }}>
			{!isEmpty(formSchema) && (
				<Form
					schema={formSchema}
					validator={validator}
					formData={changedData.formData}
					onChange={onChangedData}
					onSubmit={onSubmit}
					onError={onErrored}
				>
					{isConnected ? (
						<>
							<button
								key={'btn_singleRun_' + nodeId}
								type='submit'
								className='btn singlerun-btn'
								disabled={isDisabled}
								onClick={() => setIsSingleRunClicked(true)}
							>
								Single Run
							</button>
							<button
								key={'btn_flowRun_' + nodeId}
								type='submit'
								className='btn flowrun-btn'
								disabled={isDisabled}
								onClick={() => setIsFlowRunClicked(true)}
							>
								Flow Run
							</button>
						</>
					) : (
						<button
							key={'btn_Run_' + nodeId}
							type='submit'
							className='btn run-btn'
							disabled={isDisabled}
							onClick={() => setIsSingleRunClicked(true)}
						>
							Run
						</button>
					)}
				</Form>
			)}
		</div>
	);
}
