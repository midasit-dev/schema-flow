import React from 'react';
import { Handle, useStore, Position, useReactFlow } from 'reactflow';
import { Button, Typography } from '@midasit-dev/moaui';
import SchemaToUI from '../SchemaToUI';

//recoil
import { useRecoilValue } from 'recoil';
import { SelectedSchema } from '../RecoilAtom/recoilState';

const dimensionAttrs = ['width', 'height'];

export default function TestNode(props) {
	const { setNodes } = useReactFlow();
	const selectedSchema = useRecoilValue(SelectedSchema);

	// React.useEffect(() => {
	// 	const UI = SchemaToUI(exampleSchema);
	// 	console.log('UI: ', UI);
	// }, []);

	const dimensions = useStore((s) => {
		const node = s.nodeInternals.get('2-3');

		if (!node || !node.width || !node.height || !s.edges.some((edge) => edge.target === props.id)) {
			return null;
		}

		return {
			width: node.width,
			height: node.height,
		};
	});

	const updateDimension = (attr) => (event) => {
		setNodes((nds) =>
			nds.map((n) => {
				if (n.id === '2-3') {
					return {
						...n,
						style: {
							...n.style,
							[attr]: parseInt(event.target.value),
						},
					};
				}

				return n;
			}),
		);
	};

	return (
		<>
			<div>
				<SchemaToUI canvases={selectedSchema} />
			</div>
			<Handle type='target' position={Position.Top} />
		</>
	);
}
