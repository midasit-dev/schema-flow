import React from 'react';
import { Typography, DropList } from '@midasit-dev/moaui-components-v1';
import { useViewport } from 'reactflow';

export default function Grade(props) {
	console.log('Grade props', props);
	const { schema, formData, onChange } = props;
	const { zoom } = useViewport();
	const [value, setValue] = React.useState(formData.Object.keys(formData)[0]);
	function onChangeHandler(event) {
		console.log('onChangeHandler', event);
		setValue(event.value)
		// onChange(value);
	}

	return (
		<div style={{ width: '100%', height: '100px', marginTop: '10px', marginBottom: '10px' }}>
			<div style={{ marginBottom: '15px' }}>
				<h4>{schema.title}</h4>
			</div>
			{Object.keys(schema.properties).map((key) => {
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
							itemList={new Map([[formData[key], 1],
							["TEST", 2]])}
							width={'200px'}
							onChange={onChangeHandler}
							value={value}
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
