import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ReactFlow,
	addEdge,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	useReactFlow,
	BackgroundVariant,
	useKeyPress,
	Panel,
} from '@xyflow/react';

import CustomNode from './CustomNode/CustomNode';
import CustomEdge from './CustomEdge/CustomEdge';
import DownloadButton from './DownloadButton';
import { GetToken } from '../Common/Login/SessionChecker';

import Navbar from '../Components/Navbar';

// css
import '@xyflow/react/dist/style.css';
import './ReactFlowComp.css';

import { v4 as uuidv4 } from 'uuid';
import { isEmpty, cloneDeep } from 'lodash';

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
	SelectedSchema,
	FunctionListInfo,
	EgdesInfo,
	FlowID,
} from '../RecoilAtom/recoilReactFlowState';
import { TokenState, AccState } from '../RecoilAtom/recoilHomeState';
import { UsableFieldKeyMap } from './InputComp/Fields';

const nodeTypes = {
	customSchema: CustomNode,
};

const edgeTypes = {
	'custom-edge': CustomEdge,
};

const nodeClassName = (node) => node.type;

const getFlowData = async (flowId, token) => {
	const res = await fetch(
		`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-datas/${flowId}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	if (res.ok) {
		const data = await res.json();
		return data;
	}
	return null;
};

const ReactFlowComp = () => {
	const connectingNodeId = React.useRef(null);
	const [colorMode, setColorMode] = React.useState('light');
	const [title, setTitle] = React.useState('Untitled');
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const reactFlow = useReactFlow();
	const CPressed = useKeyPress(['c']);
	const navigate = useNavigate();

	const [selectedschema, setSelectedschema] = useRecoilState(SelectedSchema);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setEgdesInfo = useSetRecoilState(EgdesInfo);
	const [flowId, setFlowId] = useRecoilState(FlowID);
	const [token, setToken] = useRecoilState(TokenState);
	const [acc, setAcc] = useRecoilState(AccState);

	const onConnectStart = useCallback((_, { nodeId }) => {
		connectingNodeId.current = nodeId;
	}, []);

	const onChangeColorMode = (event) => {
		setColorMode(event.target.value);
	};

	function onConnectEnd(event) {
		if (!isEmpty(selectedschema)) {
			addCustomNode(event);
		}
	}

	function onClickHandler(event) {
		if (!isEmpty(selectedschema)) addCustomNode(event);
	}

	React.useEffect(() => {
		// get nodes, edges and functionlistInfo from localstorage
		if (!flowId || flowId === '') return;
		const localStorageFlow = localStorage.getItem(flowId);
		let localfunctionlistInfo = {};
		if (localStorageFlow) {
			const localFlowJson = JSON.parse(localStorageFlow);
			const localNodes = localFlowJson['nodes'];
			const localEdges = localFlowJson['edges'];
			if (localFlowJson['functionlistInfo']) {
				localfunctionlistInfo = localFlowJson['functionlistInfo'];
			}
			if (localNodes) {
				setNodes(localNodes);
			}
			if (localEdges) {
				setEdges(localEdges);
			}
			if (localfunctionlistInfo) {
				setFunctionListInfo(localfunctionlistInfo);
			}
		}
	}, [flowId]);

	React.useEffect(() => {
		async function getFlowDatasbyFlowID(flowId) {
			const result = await GetToken(token, setToken, acc, setAcc);
			if (result === 'acc is empty') return navigate('../login');
			const res = await getFlowData(flowId, token);
			if (res !== null) {
				if (res.title) setTitle(res.title);
				if (res.flowData && flowId !== '') {
					localStorage.setItem(flowId, JSON.stringify(res.flowData));
				} else {
					// localStorage
				}
			}
		}
		if (flowId === null || flowId === undefined || flowId === '') {
			if (window.location.pathname.includes('/Flow/')) {
				setFlowId(window.location.pathname.split('/')[2]);
			}
		}
		getFlowDatasbyFlowID(flowId);
	}, [flowId]);

	React.useEffect(() => {
		// set nodes to localstorage

		if (nodes.length > 0) {
			const localFlow = JSON.parse(localStorage.getItem(flowId));
			localStorage.setItem(flowId, JSON.stringify({ ...localFlow, nodes: nodes }));
		}
	}, [nodes]);

	// edge changed
	React.useEffect(() => {
		if (edges.length > 0) {
			const edgesInfo = [];
			for (let i = 0; i < edges.length; i++) {
				if (edges[i].source !== null) {
					edgesInfo.push(edges[i]);
				}
			}
			setEgdesInfo(edgesInfo);
			// set edges to localstorage
			const localFlow = JSON.parse(localStorage.getItem(flowId));
			localStorage.setItem(flowId, JSON.stringify({ ...localFlow, edges: edges }));
		}
	}, [edges]);

	React.useEffect(() => {
		// set functionlistInfo to localstorage
		if (Object.keys(functionlistInfo).length > 0) {
			const localFlow = JSON.parse(localStorage.getItem(flowId));
			localStorage.setItem(
				flowId,
				JSON.stringify({ ...localFlow, functionlistInfo: functionlistInfo }),
			);
		}
	}, [functionlistInfo]);

	// C key pressed
	React.useEffect(() => {
		if (CPressed) {
			// get localstorage FLOW
			const localStorageFlow = localStorage.getItem(flowId);
			if (localStorageFlow) {
				const localFlow = JSON.parse(localStorageFlow);
				if (localFlow['nodes'] || localFlow['edges']) {
					navigator.clipboard.writeText(localStorageFlow);
				} else {
					alert('No data about node, edge');
				}
			} else {
				alert('No Flow data in localstorage');
			}
		}
	}, [CPressed]);

	// temp make ui schema
	function temp_MakeInputUISchema(id) {
		return {
			'ui:field': UsableFieldKeyMap.CUSTOM,
			'ui:options': {
				label: false,
				hideDescription: true,
			},
		};

		if (id.includes('Concrete geometry')) {
			return {
				Polygon: {
					points: {
						'ui:widget': 'point_table',
					},
				},
			};
		} else if (id.includes('Calc 3dpm')) {
			return {
				material: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						grade: {
							'ui:field': 'matlConcGradeField',
						},
						curve_uls: {
							'ui:field': 'matlConcCurveULSField',
						},
						curve_sls: {
							'ui:field': 'matlConcCurveSLSField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
				},
				geometry: {
					'ui:options': {
						label: true,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						material: {
							'ui:field': 'matlConcGradeField',
						},
						outerPolygon: {
							'ui:field': 'polygonField',
						},
						innerPolygon: {
							'ui:field': 'polygonField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
				},
				lcb: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					uls: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						lcoms: {
							'ui:field': 'lcomField',
						},
					},
				},
				opt: {
					dgncode: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
					by_ecc_pu: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
				},
			};
		} else if (id.includes('Report rc cracked stress')) {
			return {
				material: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						grade: {
							'ui:field': 'matlConcGradeField',
						},
						curve_uls: {
							'ui:field': 'matlConcCurveULSField',
						},
						curve_sls: {
							'ui:field': 'matlConcCurveSLSField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
				},
				geometry: {
					'ui:options': {
						label: true,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						material: {
							'ui:field': 'matlConcGradeField',
						},
						outerPolygon: {
							'ui:field': 'polygonField',
						},
						innerPolygon: {
							'ui:field': 'polygonField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
				},
				lcom: {
					'ui:field': 'lcomFixedField',
				},
			};
		} else if (id.includes('Report rc mm interaction curve')) {
			return {
				material: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						grade: {
							'ui:field': 'matlConcGradeField',
						},
						curve_uls: {
							'ui:field': 'matlConcCurveULSField',
						},
						curve_sls: {
							'ui:field': 'matlConcCurveSLSField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
				},
				geometry: {
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						material: {
							'ui:field': 'matlConcGradeField',
						},
						outerPolygon: {
							'ui:field': 'polygonField',
						},
						innerPolygon: {
							'ui:field': 'polygonField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
				},
				opt: {
					dgncode: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
					by_ecc_pu: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
				},
				axialforce: {
					'ui:options': {
						label: true,
						hideDescription: true,
					},
					Nx: {
						'ui:options': {
							label: true,
							hideDescription: true,
						},
					},
				},
			};
		} else if (id.includes('Report rc moment curvature')) {
			return {
				material: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						grade: {
							'ui:field': 'matlConcGradeField',
						},
						curve_uls: {
							'ui:field': 'matlConcCurveULSField',
						},
						curve_sls: {
							'ui:field': 'matlConcCurveSLSField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
				},
				geometry: {
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						material: {
							'ui:field': 'matlConcGradeField',
						},
						outerPolygon: {
							'ui:field': 'polygonField',
						},
						innerPolygon: {
							'ui:field': 'polygonField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
				},
			};
		} else if (id.includes('Report rc pm interaction curve')) {
			return {
				material: {
					'ui:options': {
						label: false,
						hideDescription: true,
					},
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						grade: {
							'ui:field': 'matlConcGradeField',
						},
						curve_uls: {
							'ui:field': 'matlConcCurveULSField',
						},
						curve_sls: {
							'ui:field': 'matlConcCurveSLSField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								grade: {
									'ui:field': 'matlConcGradeField',
								},
								curve_uls: {
									'ui:field': 'matlConcCurveULSField',
								},
								curve_sls: {
									'ui:field': 'matlConcCurveSLSField',
								},
							},
						],
					},
				},
				geometry: {
					concrete: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						material: {
							'ui:field': 'matlConcGradeField',
						},
						outerPolygon: {
							'ui:field': 'polygonField',
						},
						innerPolygon: {
							'ui:field': 'polygonField',
						},
					},
					rebar: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
					tendon: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
						anyOf: [
							{
								'ui:options': {
									label: false,
									hideDescription: true,
								},
								points: {
									'ui:field': 'polygonField',
								},
								prop: {
									'ui:options': {
										label: false,
										hideDescription: true,
									},
									material: {
										'ui:field': 'matlConcGradeField',
									},
								},
							},
						],
					},
				},
				opt: {
					dgncode: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
					by_ecc_pu: {
						'ui:widget': 'optWidget',
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
				},
				angle: {
					'ui:options': {
						label: true,
						hideDescription: true,
					},
					theta: {
						'ui:options': {
							label: false,
							hideDescription: true,
						},
					},
				},
			};
		} else if (id.includes('Report steel bc')) {
			return {
				'ui:field': UsableFieldKeyMap.CUSTOM,
				'ui:options': {
					label: false,
					hideDescription: true,
				},
			};
		} else {
		}
	}

	function addCustomNode(event) {
		const schemadata = cloneDeep(selectedschema);
		const inputUISchema = temp_MakeInputUISchema(schemadata.id);
		const id = schemadata.id.toString() + '_' + uuidv4().slice(0, 8);
		const newNode = [
			{
				id,
				type: 'customSchema',
				position: reactFlow.screenToFlowPosition({
					x: event.clientX,
					y: event.clientY,
				}),
				data: {
					title: schemadata.title,
					schemainfo: schemadata,
					input: {
						param: {},
						UISchema: inputUISchema,
					},
					output: {
						param: {},
						UISchema: {},
					},
				},
			},
		];
		setNodes((nds) => nds.concat(newNode));
		setEdges((eds) => eds.concat({ id, source: null, target: id }));
		setFunctionListInfo((prev) => {
			const updatedItems = prev[schemadata.category].map((item) => {
				if (item.isSelected)
					return { ...item, isSelected: false, isRendered: true, viewCount: item.viewCount + 1 };
				else return item;
			});
			return { ...prev, [schemadata.category]: updatedItems };
		});
		setSelectedschema({});
	}

	const onConnect = useCallback(
		(params) => {
			// add button edge
			const edge = {
				...params,
				type: 'custom-edge',
				animated: true,
			};
			setEdges((es) => addEdge(edge, es));
		},
		[setEdges],
	);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				className={isEmpty(selectedschema) ? '' : 'creating'}
				style={{ width: '100%', height: '100%' }}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onConnectStart={onConnectStart}
					onConnectEnd={onConnectEnd}
					fitView
					attributionPosition='top-center'
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					className={'overview'}
					onClick={onClickHandler}
					colorMode={colorMode}
				>
					<Navbar title={title} />
					<MiniMap zoomable pannable nodeClassName={nodeClassName} />
					<Controls />
					<Background id='1' gap={25} variant={BackgroundVariant.Dots} />
					<Panel position='top-center'>
						<select onChange={onChangeColorMode} data-testid='colormode-select'>
							<option value='light'>light</option>
							<option value='dark'>dark</option>
							<option value='system'>system</option>
						</select>
					</Panel>
				</ReactFlow>
			</div>
		</div>
	);
};

export default ReactFlowComp;
