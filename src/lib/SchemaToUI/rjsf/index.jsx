import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId, ExecuteState } from '../../RecoilAtom/recoilState';
import { isEmpty } from 'lodash';

const outputSchema = {
	outerPolygon: {
		points: [
			{ x: 0, y: 0 },
			{ x: 600, y: 0 },
			{ x: 600, y: 400 },
			{ x: 0, y: 400 },
		],
	},
	innerPolygon: null,
	material: {
		design_code: 'ACI318M-20',
		grade: 'C123',
	},
};

const inputSchema = {
	properties: {
		outerPolygon: {
			allOf: [
				{
					properties: {
						points: {
							items: {
								properties: {
									x: { type: 'number', title: 'X' },
									y: { type: 'number', title: 'Y' },
								},
								type: 'object',
								required: ['x', 'y'],
								title: 'Point',
								description: 'Point class',
							},
							type: 'array',
							title: 'Points',
							description: 'Points',
							default: [
								{ x: 0, y: 0 },
								{ x: 400, y: 0 },
								{ x: 400, y: 600 },
								{ x: 0, y: 600 },
							],
						},
					},
					type: 'object',
					title: 'GSD Points',
					description: 'GSD Points class',
				},
			],
			description: 'Outer polygon of the concrete',
			default: {
				points: [
					{ x: 0, y: 0 },
					{ x: 400, y: 0 },
					{ x: 400, y: 600 },
					{ x: 0, y: 600 },
				],
			},
		},
		innerPolygon: {
			allOf: [
				{
					properties: {
						points: {
							items: {
								properties: {
									x: { type: 'number', title: 'X' },
									y: { type: 'number', title: 'Y' },
								},
								type: 'object',
								required: ['x', 'y'],
								title: 'Point',
								description: 'Point class',
							},
							type: 'array',
							title: 'Points',
							description: 'Points',
							default: [
								{ x: 0, y: 0 },
								{ x: 400, y: 0 },
								{ x: 400, y: 600 },
								{ x: 0, y: 600 },
							],
						},
					},
					type: 'object',
					title: 'GSD Points',
					description: 'GSD Points class',
				},
			],
			description: 'Inner polygon of the concrete',
		},
		material: {
			allOf: [
				{
					properties: {
						design_code: {
							type: 'string',
							title: 'Design Code',
							description: 'Design code',
							default: 'ACI318M-19',
						},
						grade: {
							type: 'string',
							title: 'Grade',
							description: 'Grade of the concrete',
							default: 'C12',
						},
					},
					type: 'object',
					title: 'GSD Concrete Grade',
					description: 'GSD concrete class',
				},
			],
			description: 'Material of the concrete',
			default: {
				design_code: 'ACI318M-19',
				grade: 'C12',
			},
		},
	},
	type: 'object',
	title: 'GSD Concrete Geometry',
	description: 'GSD concrete geometry class',
};

async function postFunctionExecute(path, body, enqueueSnackbar, isSuccessFunctionExecute) {
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
		// enqueueSnackbar('Success', { variant: 'success' });
		isSuccessFunctionExecute(true);
		const data = await res.json();
		console.log('data', data);
		return data;
	} else {
		isSuccessFunctionExecute(false);
		// enqueueSnackbar('Error', { variant: 'error' });
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
	const [executeState, setExecuteState] = useRecoilState(ExecuteState);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [changedData, setChangedData] = React.useState({ formData: {} });
	const [preFunctionIds, setPreFunctionIds] = React.useState([]);
	const [postFunctionIds, setPostFunctionIds] = React.useState([]);
	const [formSchema, setFormSchema] = React.useState(schema);
	const [isSingleRunClicked, setIsSingleRunClicked] = React.useState(false);
	const [isFlowRunClicked, setIsFlowRunClicked] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);

	React.useEffect(() => {
		console.log('schema', schema);
	}, []);

	React.useEffect(() => {
		console.log('formSchema', formSchema);
	}, [formSchema]);

	React.useEffect(() => {
		console.log('RJSFComp id', nodeId);
		console.log('preFunctionIds', preFunctionIds);
		console.log('postFunctionIds', postFunctionIds);

		// const updatedSchema = updateDefaults(inputSchema, outputSchema);
		// console.log('updatedSchema', updatedSchema);
	}, [preFunctionIds, postFunctionIds]);

	React.useEffect(() => {
		console.log('nodeId', nodeId);
		if (isSingleRunClicked) {
			setExecuteNodeId((prev) => {
				if (prev.includes(nodeId)) return prev;
				return [...prev, nodeId];
			});
		} else if (executeState[nodeId] && isSingleRunClicked === false) {
			setPreExecuteNodeId();
		}
	}, [executeState]);

	React.useEffect(() => {
		// executeNodeId 배열에 nodeId가 있을 때 실행
		console.log('executeNodeId', executeNodeId);
		async function run() {
			console.log('isSingleRunClicked', isSingleRunClicked);
			if (executeNodeId.length > 0) {
				if (executeNodeId.includes(nodeId) && executeState[nodeId]) {
					if (executeState[nodeId].isExecuted === false) {
						syncPreOutput2InputSchema();
						await runFunctionFromServer();
					}
					console.log('executeNodeId', executeNodeId);
					console.log('executeState', executeState);
				} else if (executeNodeId.includes(nodeId) && isSingleRunClicked) {
					console.log('singleRun');
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
					isConnectedEdge = true;
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
				if (executeState[preFunctionId]) {
					const output = executeState[preFunctionId].output;
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
	}, [executeState, preFunctionIds, schema]);

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
			if (isAllExecuted) {
				console.log('isAllExecuted', isAllExecuted);
				if (executeState[nodeId]) {
					if (executeState[nodeId].isExecuted) {
						console.log('This is already executed node: ' + nodeId);
						return;
					}
				}
				setExecuteState((prev) => {
					if (prev[nodeId]) return prev;
					return { ...prev, [nodeId]: { isExecuted: false, output: {} } };
				});
				setExecuteNodeId((prev) => {
					if (prev.includes(nodeId)) return prev;
					return [...prev, nodeId];
				});
			} else {
				for (let preFunctionId of preFunctionIds) {
					setExecuteState((prev) => {
						console.log('prev1', prev);
						const preNode = prev[preFunctionId];
						if (preNode) return prev;
						return { ...prev, [preFunctionId]: { isExecuted: false, output: {} } };
					});
				}
			}
		}
		// 선행되어야할 함수가 없을 때
		else {
			if (executeState[nodeId]) {
				if (executeState[nodeId].isExecuted) {
					console.log('This is already executed node: ' + nodeId);
					return;
				}
			}
			console.log('This is First node: ' + nodeId);
			setExecuteState((prev) => {
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
		setExecuteState,
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
		const responseData = await postFunctionExecute(
			path,
			changedData.formData,
			enqueueSnackbar,
			setResponseData,
			isSuccessFunctionExecute
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
	async function onClickedFlowRunButton() {
		console.log('clicked run button');
		setExecuteState({ [nodeId]: { isExecuted: false, output: {} } });
		// if (isEmpty(executeState)){
		// await checkPrePostFunction();
		// } else initExecuteState();
		console.log('check end');
	}

	async function onClickedSingleRunButton() {
		setExecuteState({ [nodeId]: { isExecuted: false, output: {} } });
	}

	async function onSubmit() {
		console.log('onSubmit');
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
			console.log('data', data);
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
								className='btn'
								style={{
									width: '50%',
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
								onClick={() => setIsSingleRunClicked(true)}
							>
								Single Run
							</button>
							<button
								key={'btn_flowRun_' + nodeId}
								type='submit'
								className='btn'
								style={{
									width: '50%',
									position: 'fixed',
									bottom: 0,
									left: '50%',
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
								onClick={() => setIsFlowRunClicked(true)}
							>
								Flow Run
							</button>
						</>
					) : (
						<button
							key={'btn_Run_' + nodeId}
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
