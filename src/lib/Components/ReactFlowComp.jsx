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
		if (localStorageFlow) {
			const localFlow = JSON.parse(localStorageFlow);
			const localNodes = localFlow['nodes'];
			const localEdges = localFlow['edges'];
			const localFunctionlistInfo = localFlow['functionlistInfo'];
			if (localNodes) {
				setNodes(localNodes);
			}
			if (localEdges) {
				setEdges(localEdges);
			}
			if (localFunctionlistInfo) {
				setFunctionListInfo(localFunctionlistInfo);
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

	function addCustomNode(event) {
		const schemadata = cloneDeep(selectedschema);
		console.log('schemadata', schemadata);
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
					schemainfo: schemadata,
					input: {
						UISchema: schemadata.id.includes('Concrete geometry')
							? {
									Polygon: {
										points: {
											'ui:widget': 'table',
										},
									},
							  }
							: {},
					},
				},
			},
		];
		setNodes((nds) => nds.concat(newNode));
		setEdges((eds) => eds.concat({ id, source: null, target: id }));
		setFunctionListInfo((prev) => {
			return prev.map((item) => {
				if (item.isSelected)
					return { ...item, isSelected: false, isRendered: true, viewCount: item.viewCount + 1 };
				else return item;
			});
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
