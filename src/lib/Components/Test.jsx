import React, { useCallback } from 'react';
import {
	ReactFlow,
	useNodesState,
	useEdgesState,
	addEdge,
	Handle,
	Position,
	useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';

const CustomNode = (props) => {
	const { id } = props;
	const flow = useReactFlow();
	const edges = flow.getEdges();
	const nodes = flow.getNodes();

	const handleSequentialExecution = useCallback(
		async (nodeId) => {
			// Find all nodes connected to the clicked node (nodeId)
			const connectedNodeIdArr2D = findConnectedNodeIds(nodeId, edges).reverse(); // [ [1], [2, 3] ]
			console.log('connectedNodeIdArr2D', connectedNodeIdArr2D);

			for (const connectedNodeIds of connectedNodeIdArr2D) {
				const connectedNodes = connectedNodeIds.map((nodeId) =>
					nodes.find((node) => node.id === nodeId),
				);

				const promises = [];
				for (const node of connectedNodes) {
					if (node === undefined) {
						console.error('Node not found');
						return;
					}
					console.log(`Executing action for node ${node.id}`, node);
					// Simulating async action completion (replace with your actual logic)

					promises.push(node.data.asyncCall());
				}

				const results = await Promise.all(promises);
				console.log('results:', connectedNodeIds, results);
			}
		},
		[edges],
	);

	const handleClick = useCallback(async () => {
		console.log('Node clicked:', id);
		await handleSequentialExecution(id);
	}, [handleSequentialExecution]);

	return (
		<div>
			<Handle type='target' position={Position.Top} />
			<div>{props.data.label}</div>
			<button onClick={handleClick}>Click me</button>
			<Handle type='source' position={Position.Bottom} />
		</div>
	);
};

const nodeTypes = {
	customNode: CustomNode,
};

export default function Flow() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<ReactFlow
				nodeTypes={nodeTypes}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			/>
		</div>
	);
}

const findConnectedNodeIds = (startNodeId, edges) => {
	// Initialize a queue for BFS
	const queue = [startNodeId];
	// Initialize a set to keep track of visited nodes
	const visitedNodes = new Set();
	// Initialize an array to store connected nodes in BFS order
	const connectedNodes = [];

	// Perform BFS
	while (queue.length > 0) {
		const currentNodeId = queue.shift();

		// Skip if the node is already visited
		if (visitedNodes.has(currentNodeId)) continue;

		// Mark the current node as visited
		visitedNodes.add(currentNodeId);

		// Find all edges where currentNodeId is the target
		const relatedEdges = edges.filter((edge) => edge.target === currentNodeId);

		const connectedNodesChunk = [];
		for (const relatedEdge of relatedEdges) {
			if (!connectedNodes.some((nodes) => nodes.includes(relatedEdge.source))) {
				connectedNodesChunk.push(relatedEdge.source);
			}
		}
		if (connectedNodesChunk.length > 0) {
			connectedNodes.push(connectedNodesChunk);
		}

		// Enqueue all connected nodes (source of the edge)
		relatedEdges.forEach((edge) => {
			if (!visitedNodes.has(edge.source)) {
				queue.push(edge.source);
			}
		});
	}

	return connectedNodes;
};

const doAsyncCall = async () => {
	const res = await fetch('https://moa-engineers.midasit.com/health');
	if (res.ok) {
		const data = await res.json();
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('API call result:', data);
		return data;
	} else {
		console.error('API call failed');
		return {};
	}
};

const initialNodes = [
	{
		id: '1',
		type: 'customNode',
		data: {
			label: 'Node 1',
			asyncCall: doAsyncCall,
		},
		position: {
			x: -172.5,
			y: 91.5,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '2',
		type: 'customNode',
		data: {
			label: 'Node 2',
			asyncCall: doAsyncCall,
		},
		position: {
			x: -5,
			y: 89,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '3',
		type: 'customNode',
		data: {
			label: 'Node 3',
			asyncCall: doAsyncCall,
		},
		position: {
			x: -114.5,
			y: 199,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '4',
		type: 'customNode',
		data: {
			label: 'Node 4',
			asyncCall: doAsyncCall,
		},
		position: {
			x: 165.5,
			y: 97,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '5',
		type: 'customNode',
		data: {
			label: 'Node 5',
			asyncCall: doAsyncCall,
		},
		position: {
			x: 318,
			y: 102,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '6',
		type: 'customNode',
		data: {
			label: 'Node 6',
			asyncCall: doAsyncCall,
		},
		position: {
			x: 246.5,
			y: 198,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
	{
		id: '7',
		type: 'customNode',
		data: {
			label: 'Node 7',
			asyncCall: doAsyncCall,
		},
		position: {
			x: 65.5,
			y: 330,
		},
		measured: {
			width: 102,
			height: 66,
		},
		selected: false,
		dragging: false,
	},
];

const initialEdges = [
	{
		source: '1',
		target: '3',
		id: 'xy-edge__1-3',
	},
	{
		source: '2',
		target: '3',
		id: 'xy-edge__2-3',
	},
	{
		source: '3',
		target: '7',
		id: 'xy-edge__3-7',
	},
	{
		source: '4',
		target: '6',
		id: 'xy-edge__4-6',
	},
	{
		source: '5',
		target: '6',
		id: 'xy-edge__5-6',
	},
	{
		source: '6',
		target: '7',
		id: 'xy-edge__6-7',
	},
];
