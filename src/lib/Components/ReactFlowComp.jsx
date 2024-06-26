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

import 'reactflow/dist/style.css';
import './overview.css';
import { isEmpty, cloneDeep } from 'lodash';
// recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Nodetypes, SelectedSchema, FunctionListInfo, EgdesInfo } from '../RecoilAtom/recoilState';

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

const ReactFlowComp = () => {
	const connectingNodeId = React.useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [nodetypes, setNodetypes] = useRecoilState(Nodetypes);
	const [selectedschema, setSelectedschema] = useRecoilState(SelectedSchema);
	const [functionlistInfo, setFunctionListInfo] = useRecoilState(FunctionListInfo);
	const { screenToFlowPosition } = useReactFlow();
	const setEgdesInfo = useSetRecoilState(EgdesInfo);

	// React.useEffect(() => {
	// console.log(selectedschema);
	// }, [selectedschema]);

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
		}
	}, [edges]);

	function addCustomNode(event) {
		const schemadata = cloneDeep(selectedschema);
		const id = 'Custom_' + schemadata.id.toString();
		const newNode = [
			{
				id,
				type: 'customSchema',
				position: screenToFlowPosition({
					x: event.clientX,
					y: event.clientY,
				}),
				data: { schemainfo: schemadata, onRemove: removeCustomNode },
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

	const removeCustomNode = (nodeId, functionId) => {
		setNodes((nds) => nds.filter((node) => node.id !== nodeId));
		setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
		setFunctionListInfo((prev) => {
			return prev.map((item) => {
				if (item.id === functionId) {
					const viewCount = item.viewCount - 1;
					return { ...item, isRendered: viewCount > 0 ? true : false, viewCount: viewCount };
				} else return item;
			});
		});
	};

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
				style: { stroke: 'blue', strokeWidth: 3, strokeDasharray: '6'},
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
