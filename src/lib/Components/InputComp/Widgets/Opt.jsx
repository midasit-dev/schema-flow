import React from 'react';
import { Typography, DropList } from '@midasit-dev/moaui-components-v1';
import { useViewport } from 'reactflow';

export default function Optwidget(props) {
	const { schema, formData, onChange } = props;
	const { zoom } = useViewport();
	console.log("Opt props", props);
	// console.log("schema", schema);

	const data = schema.enum.map((item, index) => {
		return { value: item, label: item };
	});

	return (
		<div style={{ width: '100%', height: '100px', marginTop: '10px', marginBottom: '10px' }}>
			<div style={{ marginBottom: '15px' }}>
				<h4>{schema.title}</h4>
			</div>
			<div
				key={`div_${schema.title}` }
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '15px',
				}}
			>
				<Typography variant='h1' size='large'>
					{schema.title}
				</Typography>
				<DropList
					itemList={new Map([[formData[key], 1]])}
					width={'200px'}
					onChange={() => {}}
					value={1}
					listWidth={'200px'}
					backgroundColor='white'
					placeholder={key}
					maxLength={10}
					scale={zoom}
				/>
			</div>
		</div>
	);
}
