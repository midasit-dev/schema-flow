import React, { useCallback } from 'react';
import ReactFlow, {
	addEdge,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	useReactFlow,
	BackgroundVariant,
	useKeyPress,
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import AnnotationNode from './AnnotationNode';
import ToolbarNode from './ToolbarNode';
import ResizerNode from './ResizerNode';
import CircleNode from './CircleNode';
import TextNode from './TextNode';
import ButtonEdge from './ButtonEdge';
import CustomNode from './CustomNode/CustomNode';
import CustomEdge from './CustomEdge/CustomEdge';

import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';
import './overview.css';
import { isEmpty, cloneDeep } from 'lodash';
// recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SelectedSchema, FunctionListInfo, EgdesInfo } from '../RecoilAtom/recoilState';

const nodeTypes = {
	annotation: AnnotationNode,
	tools: ToolbarNode,
	resizer: ResizerNode,
	circle: CircleNode,
	textinput: TextNode,
	customSchema: CustomNode,
};

const edgeTypes = {
	'custom-edge': CustomEdge,
};

const nodeClassName = (node) => node.type;

const nodesLengthSelector = (state) => Array.from(state.nodeInternals.values()) || 0;

const ReactFlowComp = () => {
	const connectingNodeId = React.useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const reactFlow = useReactFlow();
	const CPressed = useKeyPress(['c']);

	const [selectedschema, setSelectedschema] = useRecoilState(SelectedSchema);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const setEgdesInfo = useSetRecoilState(EgdesInfo);

	const onConnectStart = useCallback((_, { nodeId }) => {
		connectingNodeId.current = nodeId;
	}, []);

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
		const localStorageFlow = localStorage.getItem('FLOW');
		let localfunctionlistInfo = {};
		if (localStorageFlow) {
			const localFlowJson = JSON.parse(localStorageFlow);
			const localNodes = localFlowJson['nodes'];
			const localEdges = localFlowJson['edges'];
			if (Array.isArray(localFlowJson.functionlistInfo)) {
				localStorage.removeItem('FLOW');
			} else {
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
	}, []);

	React.useEffect(() => {
		// set nodes to localstorage

		if (nodes.length > 0) {
			const localFlow = JSON.parse(localStorage.getItem('FLOW'));
			localStorage.setItem('FLOW', JSON.stringify({ ...localFlow, nodes: nodes }));
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
			const localFlow = JSON.parse(localStorage.getItem('FLOW'));
			localStorage.setItem('FLOW', JSON.stringify({ ...localFlow, edges: edges }));
		}
	}, [edges]);

	React.useEffect(() => {
		// set functionlistInfo to localstorage
		if (Object.keys(functionlistInfo).length > 0) {
			const localFlow = JSON.parse(localStorage.getItem('FLOW'));
			localStorage.setItem(
				'FLOW',
				JSON.stringify({ ...localFlow, functionlistInfo: functionlistInfo }),
			);
		}
	}, [functionlistInfo]);

	// C key pressed
	React.useEffect(() => {
		if (CPressed) {
			// get localstorage FLOW
			const localStorageFlow = localStorage.getItem('FLOW');
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
		} 
		else if (id.includes('Report rc cracked stress')) {
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
				lcom:{
					'ui:field': 'lcomFixedField',
				}
			}
		}
		else return {};
	}

	function addCustomNode(event) {
		const schemadata = cloneDeep(selectedschema);
		console.log('schemadata', schemadata);

		const inputUISchema = temp_MakeInputUISchema(schemadata.id);
		console.log('uiSchema', inputUISchema);
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
				>
					<MiniMap zoomable pannable nodeClassName={nodeClassName} />
					<Controls />
					<Background id='1' gap={25} variant={BackgroundVariant.Lines} />
				</ReactFlow>
			</div>
		</div>
	);
};

export default ReactFlowComp;
