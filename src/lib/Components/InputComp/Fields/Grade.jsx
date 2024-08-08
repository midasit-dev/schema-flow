import React from 'react';
import { Typography, DropList } from '@midasit-dev/moaui-components-v1';
import { useViewport } from 'reactflow';

export default function MatlConc_grade(props) {
	const { schema, formData, onChange } = props;
	const { zoom } = useViewport();
	console.log("formData", formData);
	console.log("schema", schema);

	return (
		<div style={{ width: '100%', height: '100px', marginTop: '10px', marginBottom: '10px' }}>
			<div style={{ marginBottom: '15px' }}>
				<h4>{schema.title}</h4>
			</div>
			{Object.keys(schema.properties).map((key) => {
				console.log('key', key);
				return (
					<div
						key={'div_' + key}
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '15px',
						}}
					>
						<Typography variant='h1' size='large'>
							{schema.properties[key].title}
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
				);
			})}
		</div>
	);
}
