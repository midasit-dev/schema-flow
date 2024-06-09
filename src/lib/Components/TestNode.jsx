import React from 'react';
import { Handle, useStore, Position, useReactFlow } from 'reactflow';
import { Button, Typography } from '@midasit-dev/moaui';
import SchemaToUI from '../SchemaToUI';

const dimensionAttrs = ['width', 'height'];

const exampleSchema = {
	canvas_1: {
		width: 640,
		height: 256,
		layers: [
			{
				id: '1-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 0,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '1-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '1-Typography',
						type: 'Typography',
						props: {
							children: 'text_to_plate_mesh',
							width: 'auto',
							height: 'auto',
							variant: 'h1',
							color: 'primary',
							size: 'large',
						},
						children: [],
					},
					{
						id: '2-Typography',
						type: 'Typography',
						props: {
							children:
								'Convert the text to a plate mesh and upload the image as a triangular mesh to MIDAS CIVIL.',
							width: 'auto',
							height: 'auto',
							variant: 'body1',
							color: 'primary',
							size: 'small',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '2-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 64,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '2-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '2-TextField',
						type: 'TextField',
						props: {
							title: 'text',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '3-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 128,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '3-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '3-TextField',
						type: 'TextField',
						props: {
							title: 'insert',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
			{
				id: '4-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 192,
					width: 640,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '4-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '4-TextField',
						type: 'TextField',
						props: {
							title: 'height',
							placeholder: 'Placeholder',
							wrappedWidth: '200px',
							width: '150px',
							height: '30px',
						},
						children: [],
					},
				],
				parent: null,
			},
		],
	},
	canvas_run: {
		width: 250,
		height: 100,
		layers: [
			{
				id: '6-FloatingBox',
				type: 'FloatingBox',
				props: {
					x: 0,
					y: 0,
					width: 220,
					height: 64,
					guideBoxProps: {
						width: 'inherit',
						height: 'inherit',
						id: '6-FloatingBox',
						spacing: 1,
						center: true,
					},
				},
				children: [
					{
						id: '6-Button',
						type: 'Button',
						props: {
							children: '실행하기',
							width: '120px',
							variant: 'contained',
							color: 'negative',
						},
						children: [],
					},
				],
				parent: null,
			},
		],
	},
};

export default function TestNode(props) {
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
			<div>
				<SchemaToUI canvases={exampleSchema} />
			</div>
			<Handle type='target' position={Position.Top} />
		</>
	);
}
