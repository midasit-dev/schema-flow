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
	MarkerType,
	useStore
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import AnnotationNode from './AnnotationNode';
import ToolbarNode from './ToolbarNode';
import ResizerNode from './ResizerNode';
import CircleNode from './CircleNode';
import TextNode from './TextNode';
import ButtonEdge from './ButtonEdge';
import CustomNode from './CustomNode/CustomNode';
import CustomEdge from './CustomEdge';

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
	'custom-edge': ButtonEdge,
};

const nodeClassName = (node) => node.type;

const nodesLengthSelector = (state) => Array.from(state.nodeInternals.values()) || 0;

const ReactFlowComp = () => {
	const connectingNodeId = React.useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedschema, setSelectedschema] = useRecoilState(SelectedSchema);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const reactFlow = useReactFlow();
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
		const localNodes = localStorage.getItem('nodes');
		const localEdges = localStorage.getItem('edges');
		const localFunctionlistInfo = localStorage.getItem('functionlistInfo');
		if (localNodes) {
			setNodes(JSON.parse(localNodes));
		}
		if (localEdges) {
			setEdges(JSON.parse(localEdges));
		}
		if (localFunctionlistInfo) {
			setFunctionListInfo(JSON.parse(localFunctionlistInfo));
		}
	}, []);

	React.useEffect(() => {
		// set nodes to localstorage
		if (nodes.length > 0) {
			console.log('save nodes', nodes);
			localStorage.setItem('nodes', JSON.stringify(nodes));
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
			localStorage.setItem('edges', JSON.stringify(edges));
		}
	}, [edges]);

	React.useEffect(() => {
		// set functionlistInfo to localstorage
		if (functionlistInfo.length > 0) {
			localStorage.setItem('functionlistInfo', JSON.stringify(functionlistInfo));
		}
	}, [functionlistInfo]);

	function addCustomNode(event) {
		const schemadata = cloneDeep(selectedschema);
		const id = schemadata.id.toString() + '_' + uuidv4().slice(0, 8);
		const newNode = [
			{
				id,
				type: 'customSchema',
				position: reactFlow.screenToFlowPosition({
					x: event.clientX,
					y: event.clientY,
				}),
				data: { schemainfo: schemadata },
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
				type: 'button',
				label: 'Delete',
				animated: true,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 12,
					height: 12,
					color: '#000',
				},
				style: { stroke: 'blue', strokeWidth: 3, strokeDasharray: '6' },
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
				className='overview'
				onClick={onClickHandler}
			>
				<MiniMap zoomable pannable nodeClassName={nodeClassName} />
				<Controls />
				<Background id='1' gap={25} variant={BackgroundVariant.Lines} />
			</ReactFlow>
		</div>
	);
};

export default ReactFlowComp;
