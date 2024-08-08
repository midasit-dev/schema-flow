import React from 'react';
import { Typography, DropList } from '@midasit-dev/moaui-components-v1';
import { useViewport } from 'reactflow';

export default function MatlConc_grade(props) {
	const { schema, formData, onChange } = props;
	const { zoom } = useViewport();

	return (
		<div style={{ width: '100%' }}>
			<h4>{schema.title}</h4>
			{Object.keys(schema.properties).map((key) => (
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
						itemList={
							new Map([
								[formData[key], 1],
								['TEST2', 2],
							])
						}
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
			))}
		</div>
	);
}
