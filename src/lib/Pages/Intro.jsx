import React from 'react';
import {
	ReactFlow,
	ReactFlowProvider,
	Background,
	BackgroundVariant,
	useReactFlow,
} from '@xyflow/react';
import slides from '../Common/slides';

import '@xyflow/react/dist/style.css';
import './Intro.css';
import { Slide, SlideData, SLIDE_WIDTH, SLIDE_HEIGHT, SLIDE_PADDING } from '../Components/Slide';

const slidesToElements = () => {
	const start = Object.keys(slides)[0];
	const stack = [{ id: start, position: { x: 0, y: 0 } }];
	const visited = new Set();
	const nodes = [];
	const edges = [];

	while (stack.length) {
		const { id, position } = stack.pop();
		const slide = slides[id];
		const node = {
			id,
			type: 'slide',
			position,
			data: slide,
			draggable: false,
		};

		if (slide.left && !visited.has(slide.left)) {
			const nextPosition = {
				x: position.x - (SLIDE_WIDTH + SLIDE_PADDING),
				y: position.y,
			};

			stack.push({ id: slide.left, position: nextPosition });
			edges.push({
				id: `${id}->${slide.left}`,
				source: id,
				target: slide.left,
			});
		}

		if (slide.up && !visited.has(slide.up)) {
			const nextPosition = {
				x: position.x,
				y: position.y - (SLIDE_HEIGHT + SLIDE_PADDING),
			};

			stack.push({ id: slide.up, position: nextPosition });
			edges.push({ id: `${id}->${slide.up}`, source: id, target: slide.up });
		}

		if (slide.down && !visited.has(slide.down)) {
			const nextPosition = {
				x: position.x,
				y: position.y + (SLIDE_HEIGHT + SLIDE_PADDING),
			};

			stack.push({ id: slide.down, position: nextPosition });
			edges.push({
				id: `${id}->${slide.down}`,
				source: id,
				target: slide.down,
			});
		}

		if (slide.right && !visited.has(slide.right)) {
			const nextPosition = {
				x: position.x + (SLIDE_WIDTH + SLIDE_PADDING),
				y: position.y,
			};

			stack.push({ id: slide.right, position: nextPosition });
			edges.push({
				id: `${id}->${slide.down}`,
				source: id,
				target: slide.down,
			});
		}

		nodes.push(node);
		visited.add(id);
	}

	return { start, nodes, edges };
};

const nodeTypes = {
	slide: Slide,
};

function App() {
	const { fitView } = useReactFlow();
	const [currentSlide, setCurrentSlide] = React.useState('1');
	const { start, nodes, edges } = React.useMemo(() => slidesToElements(), []);

	const handleKeyPress = React.useCallback(
		(event) => {
			const slide = slides[currentSlide];

			switch (event.key) {
				case 'ArrowLeft':
				case 'ArrowUp':
				case 'ArrowDown':
				case 'ArrowRight': {
					const direction = event.key.slice(5).toLowerCase();
					const target = slide[direction];

					// Prevent the arrow keys from scrolling the page when React Flow is
					// only part of a larger application.
					event.preventDefault();

					if (target) {
						setCurrentSlide(target);
						fitView({ nodes: [{ id: target }], duration: 100 });
					}
					break; // Add a break statement to handle the default case
				}
				default: {
					// Handle the default case here
					// For example, you can log an error message or perform some other action
					console.error('Invalid key pressed');
					break;
				}
			}
		},
		[fitView, currentSlide],
	);

	const handleNodeClick = React.useCallback(
		(_, node) => {
			fitView({ nodes: [{ id: node.id }], duration: 150 });
		},
		[fitView],
	);

	return (
		<ReactFlow
			nodes={nodes}
			nodeTypes={nodeTypes}
			edges={edges}
			fitView
			fitViewOptions={{ nodes: [{ id: start }] }}
			minZoom={0.1}
			onNodeClick={handleNodeClick}
			onKeyDown={handleKeyPress}
		>
			<Background color='#f2f2f2' variant={BackgroundVariant.Lines} />
		</ReactFlow>
	);
}

export default function Intro() {
	return (
		<ReactFlowProvider>
			<div style={{ width: '100vw', height: '100vh' }}>
				<App />
			</div>
		</ReactFlowProvider>
	);
}
