import React from 'react';
// import Form from '@rjsf/core';
import Form from '@rjsf/semantic-ui';

import validator from '@rjsf/validator-ajv8';
import { useRecoilValue, useRecoilState } from 'recoil';
import { EgdesInfo, ExecuteNodeId, ExecuteFlow, ExecuteState } from '../../RecoilAtom/recoilReactFlowState';
import { isEmpty } from 'lodash';
import './index.css';
import MuiDataGridWidget from '../../Components/InputComp/Widgets/Datagrid_mui';
import GradeField from '../../Components/InputComp/Fields/Grade';
import DataGridField from '../../Components/InputComp/Fields/Datagrid';
import Curve_uls_sls_Field from '../../Components/InputComp/Fields/Curve_uls_sls';
import PolygonField from '../../Components/InputComp/Fields/Polygon';
import LcomField from '../../Components/InputComp/Fields/Lcom';
import LcomFixedField from '../../Components/InputComp/Fields/Lcom_Fixed';
import OptWidget from '../../Components/InputComp/Widgets/Opt';

async function postFunctionExecuteToST(executeURI, body, isSuccessFunctionExecute) {
	// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
	const res = await fetch(`${executeURI}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	if (res.ok) {
		isSuccessFunctionExecute(true);
		const data = await res.json();
		// console.log('data', data);
		return data;
	} else {
		isSuccessFunctionExecute(false);
		return {};
	}
}

function updateDefaults(inputSchema, outputSchema) {
	for (const key in outputSchema) {
		if (inputSchema.properties) {
			if (inputSchema.properties.hasOwnProperty(key)) {
				if (outputSchema[key] !== null) inputSchema.properties[key].default = outputSchema[key];
				else continue;

				// Recursively update nested properties if necessary
				if (
					typeof outputSchema[key] === 'object' &&
					!Array.isArray(outputSchema[key]) &&
					inputSchema.properties[key].properties
				) {
					updateDefaults(inputSchema.properties[key], outputSchema[key]);
				}
			}
		} else if (inputSchema.hasOwnProperty('anyOf')) {
			for (let i = 0; i < inputSchema.anyOf.length; i++) {
				updateDefaults(inputSchema.anyOf[i], outputSchema);
			}
		}
	}
	return inputSchema;
}

export default function RJSFComp(props) {
	const {
		nodeId,
		schema,
		input,
		executeURI,
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
	const [formSchema, setFormSchema] = React.useState(schema);
	const [isSingleRunClicked, setIsSingleRunClicked] = React.useState(false);
	const [isFlowRunClicked, setIsFlowRunClicked] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);
	const [execute, setExecute] = React.useState(false);
	const [allConnectedNodes, setAllConnectedNodes] = React.useState([]);

	React.useEffect(() => {
		console.log('changedData', changedData);
	}, [changedData]);

	React.useEffect(() => {
		console.log('uischema', input.UISchema);
		setExecuteState((prev) => {
			// prev example
			// {
			// 	"nodeId": {
			// 		'setExecute': setExecute,
			// 		'setIsResultView': setIsResultView,
			// 		'setIsSuccess': setIsSuccess,
			// 		'setIsError': setIsError
			// 	}
			// };
			return { ...prev, [nodeId]: { ...prev[nodeId], setExecute } };
		});
	}, []);

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
		} else if (executeFlow[nodeId] && execute === false) {
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
		let preFunctionIds = [];
		if (edgesInfo.length > 0) {
			for (let i = 0; i < edgesInfo.length; i++) {
				if (edgesInfo[i].target === nodeId) {
					isConnectedEdge = true;
					const sourceNodeId = edgesInfo[i].source;
					if (preFunctionIds.includes(sourceNodeId) === false) preFunctionIds.push(sourceNodeId);
				}
			}
			setPreFunctionIds(preFunctionIds);
			const flowNodes = checkConnectedNodes();
			setAllConnectedNodes(flowNodes);
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

	function checkConnectedNodes(Nodes = []) {
		let connectedNodes = Nodes.length > 0 ? Nodes : [nodeId];
		if (edgesInfo.length > 0) {
			let sourceNodes = [];
			connectedNodes.map((node) => {
				for (let i = 0; i < edgesInfo.length; i++) {
					if (edgesInfo[i].target === node) {
						if (connectedNodes.includes(edgesInfo[i].source) === false) {
							connectedNodes.push(edgesInfo[i].source);
							sourceNodes.push(edgesInfo[i].source);
						}
					}
				}
				if (sourceNodes.length > 0) {
					const newNodes = checkConnectedNodes(sourceNodes);
					connectedNodes = connectedNodes.concat(newNodes);
				}
			});
		}
		const resultNodes = [...new Set(connectedNodes)];
		return resultNodes;
	}

	const initExecuteState = React.useCallback(() => {
		if (Object.keys(executeState).length > 0) {
			allConnectedNodes.map((node) => {
				for (let key in executeState) {
					if (key === node) {
						if (executeState[key]) {
							executeState[key]['setExecute'](false);
							executeState[key]['setIsResultView'](false);
							executeState[key]['setIsSuccess'](false);
							executeState[key]['setIsError'](false);
						}
					}
				}
			});
		}
	}, [executeState, allConnectedNodes]);

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
	]);

	async function runFunctionFromServer() {
		setIsloading(true);
		let responseData = {};
		try {
			responseData = await postFunctionExecuteToST(
				executeURI,
				changedData.formData,
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
		setExecuteFlow({ [nodeId]: { isExecuted: false, output: {} } });
	}

	async function onClickedSingleRunButton() {
		executeState[nodeId]['setExecute'](false);
		executeState[nodeId]['setIsResultView'](false);
		executeState[nodeId]['setIsSuccess'](false);
		executeState[nodeId]['setIsError'](false);
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

	function onMouseEnterHandler() {
		allConnectedNodes.map((node) => {
			if (executeState[node]) {
				executeState[node]['setIsShake'](true);
			}
		});
	}

	function onMouseLeaveHandler() {
		allConnectedNodes.map((node) => {
			if (executeState[node]) {
				executeState[node]['setIsShake'](false);
			}
		});
	}

	function onErrored(event) {
		console.log('error', event);
	}

	return (
		<div key={'rjsf_div'} style={{ paddingRight: '10px' }}>
			{!isEmpty(formSchema) && (
				<Form
					schema={formSchema}
					uiSchema={input.UISchema}
					widgets={{
						optWidget: OptWidget,
					}}
					fields={{
						matlConcGradeField: GradeField,
						matlConcCurveULSField: Curve_uls_sls_Field,
						matlConcCurveSLSField: Curve_uls_sls_Field,
						polygonField: PolygonField,
						lcomField: LcomField,
						lcomFixedField: LcomFixedField,
					}}
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
								onMouseEnter={onMouseEnterHandler}
								onMouseLeave={onMouseLeaveHandler}
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
