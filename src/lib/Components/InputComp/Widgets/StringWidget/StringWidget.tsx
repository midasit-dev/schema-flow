import { TextField } from '@midasit-dev/moaui-components-v1';
import './StringWidget.css';
import { ChangeEvent } from 'react';
import { SchemaProperty } from '../../Fields/FieldsUtil';

interface StringWidgetProps {
	field: SchemaProperty;
	value: string;
	handleChange: (value: string) => void;
}

export default function StringWidget({ field, value, handleChange }: StringWidgetProps) {
	const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
		handleChange(e.target.value);
	};

	return (
		<div className={'string-widget-wrapper'}>
			<TextField
				type={'text'}
				placeholder={field.description}
				onChange={handleChangeText}
				value={value}
			/>
			<div className={'string-widget-description-wrapper'}>{field.description}</div>
		</div>
	);
}
