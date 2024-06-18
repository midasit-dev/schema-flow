import React, { useCallback } from 'react';
import ReactFlow, {
	addEdge,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	useReactFlow,
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import AnnotationNode from './AnnotationNode';
import ToolbarNode from './ToolbarNode';
import ResizerNode from './ResizerNode';
import CircleNode from './CircleNode';
import TextNode from './TextNode';
import ButtonEdge from './ButtonEdge';
import CustomNode from './CustomNode/CustomNode';

import 'reactflow/dist/style.css';
import './overview.css';
import { isEmpty, cloneDeep } from 'lodash';
// recoil
import { useRecoilState } from 'recoil';
import { Nodetypes, SelectedSchema, FunctionListInfo } from '../RecoilAtom/recoilState';

const nodeTypes = {
	annotation: AnnotationNode,
	tools: ToolbarNode,
	resizer: ResizerNode,
	circle: CircleNode,
	textinput: TextNode,
	customSchema: CustomNode,
};

const edgeTypes = {
	button: ButtonEdge,
};

const nodeClassName = (node) => node.type;

const ReactFlowComp = () => {
	const connectingNodeId = React.useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [nodetypes, setNodetypes] = useRecoilState(Nodetypes);
	const [selectedschema, setSelectedschema] = useRecoilState(SelectedSchema);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const { screenToFlowPosition } = useReactFlow();

	// React.useEffect(() => {
	// console.log(selectedschema);
	// }, [selectedschema]);

	const onConnectStart = useCallback((_, { nodeId }) => {
		connectingNodeId.current = nodeId;
	}, []);

	function onConnectEnd(event) {
		if (!isEmpty(selectedschema)) addCustomNode(event);
	}

	function onClickHandler(event) {
		if (!isEmpty(selectedschema)) addCustomNode(event);
	}

	function addCustomNode(event) {
		const id = (nodes.length + 1).toString();
		const schemadata = cloneDeep(selectedschema);
		const newNode = [
			{
				id,
				type: 'customSchema',
				position: screenToFlowPosition({
					x: event.clientX,
					y: event.clientY,
				}),
				data: { schema: schemadata, onRemove: removeCustomNode },
			},
		];
		setNodes((nds) => nds.concat(newNode));
		setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));
		setFunctionListInfo((prev) => {
			return prev.map((item) => {
				if (item.isSelected)
					return { ...item, isSelected: false, isRendered: true, viewCount: item.viewCount + 1 };
				else return item;
			});
		});
		setSelectedschema({});
	}

	const removeCustomNode = (id) => {
		setNodes((nds) => nds.filter((node) => node.id !== id));
		setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
		setFunctionListInfo((prev) => {
			return prev.map((item) => {
				return { ...item, isRendered: false };
			});
		});
	};

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

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
				<Background />
			</ReactFlow>
		</div>
	);
};

export default ReactFlowComp;
