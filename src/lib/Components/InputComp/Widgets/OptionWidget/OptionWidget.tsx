import { DropList } from '@midasit-dev/moaui-components-v1';
import { SelectChangeEvent } from '@mui/material/Select';
import './OptionWidget.css';
import { SchemaProperty } from '../../Fields/FieldsUtil';

interface OptionWidgetProps {
	field: SchemaProperty;
	value: string;
	handleChange: (value: string) => void;
}

export default function OptionWidget({ value, handleChange, field }: OptionWidgetProps) {
	const onChangeOptionValue = (event: SelectChangeEvent) => {
		const newValue = field.enum?.find((_, idx) => idx === Number(event.target.value));
		if (!newValue) return;
		handleChange(newValue);
	};

	if (!field.enum) return <></>;

	return (
		<div className={'option-widget-wrapper'}>
			<DropList
				value={field.enum.findIndex((item) => item === value)}
				itemList={field.enum.map((enumKey, idx) => [enumKey, idx])}
				onChange={onChangeOptionValue}
				width={'150px'}
				listWidth={'150px'}
			/>
			<div className={'option-widget-description-wrapper'}>{field.description}</div>
		</div>
	);
}
