import React from 'react';
import { Typography, DropList } from '@midasit-dev/moaui-components-v1';
import { useViewport } from 'reactflow';

export default function Optwidget(props) {
	// console.log('Opt props', props);
	const { schema, formData, onChange } = props;
	const { zoom } = useViewport();
	const [value, setValue] = React.useState(schema.default);
	const itemData = new Map(schema.enum.map((item) => [item, item]));

	function onChangeHandler(event) {
		setValue(event.target.value);
		onChange(event.target.value);
	}

	return (
		<div style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
			<div
				key={`div_${schema.title}`}
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
					itemList={itemData}
					width={'200px'}
					onChange={onChangeHandler}
					value={value}
					listWidth={'200px'}
					backgroundColor='white'
					placeholder={schema.title}
					maxLength={10}
					scale={zoom}
				/>
			</div>
		</div>
	);
}
