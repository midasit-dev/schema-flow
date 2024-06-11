import React from 'react';
import { Handle, useStore, Position, useReactFlow, NodeResizer } from 'reactflow';
import { Button, Typography } from '@midasit-dev/moaui';
import { isEmpty } from 'lodash';

import SchemaToUI from '../SchemaToUI';

//recoil
import { useRecoilValue } from 'recoil';
import { SelectedSchema } from '../RecoilAtom/recoilState';

export default function CustomNode(props) {
	const { data } = props;
	React.useEffect(() => {
		console.log('CustomNode props data: ', data);
	}, []);

	const { setNodes } = useReactFlow();

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
			{!isEmpty(data.schema) && (
				<>
					<div>
						<SchemaToUI canvas={data.schema['canvas']} />
					</div>
					<Handle type='target' position={Position.Top} />
					<Handle type='target' position={Position.Bottom} />
					<Handle type='target' position={Position.Left} />
					<Handle type='target' position={Position.Right} />
				</>
			)}
		</>
	);
}
