import { TextField, Typography } from '@midasit-dev/moaui-components-v1';
import './NumberWidget.css';
import { ChangeEvent } from 'react';
import { SchemaProperty } from '../../Fields/FieldsUtil';

interface NumberWidgetProps {
	field: SchemaProperty;
	value: string;
	handleChange: (value: string) => void;
}

type Unit = 'force' | 'moment' | 'length';

const UnitMap: Record<Unit, string> = {
	moment: 'Nm',
	length: 'm',
	force: 'N',
};

export default function NumberWidget({ field, value, handleChange }: NumberWidgetProps) {
	const handleChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
		handleChange(e.target.value);
	};

	return (
		<div className={'number-widget-wrapper'}>
			<TextField type={'number'} onChange={handleChangeNumber} value={value} />
			{field.unit && (
				<div className={'number-widget-unit-wrapper'}>
					<Typography color='primary' variant='h1'>
						{UnitMap[field.unit as Unit] ?? field.unit}
					</Typography>
				</div>
			)}
			<div className={'number-widget-description-wrapper'}>{field.description}</div>
		</div>
	);
}
