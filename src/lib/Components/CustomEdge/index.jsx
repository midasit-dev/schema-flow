import { BaseEdge, EdgeLabelRenderer, getSimpleBezierPath , useReactFlow, getMarkerEnd , MarkerType } from 'reactflow';
import './CustomEdge.css';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
	const { setEdges } = useReactFlow();
	const [edgePath, labelX, labelY] = getSimpleBezierPath ({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	const markerEndId = getMarkerEnd(MarkerType.ArrowClosed);

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				style={{ stroke: 'blue', strokeDasharray: '6', strokeWidth: '3' }}
			/>
			<EdgeLabelRenderer>
				<button
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						pointerEvents: 'all',
					}}
					className='nodrag nopan delete-button'
					onClick={() => {
						setEdges((es) => es.filter((e) => e.id !== id));
					}}
				>
					Delete
				</button>
			</EdgeLabelRenderer>
		</>
	);
}
