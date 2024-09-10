import MatlConc_curve_uls from './Curve_uls_sls';
import PolygonField from './Polygon';
import Lcom_FiexedField from './Lcom_Fixed';
import LcomField from './Lcom';
import { ReactElement } from 'react';
import { DropList, TextField } from '@midasit-dev/moaui-components-v1';

export interface SchemaForm {
	[key: string]: SchemaForm | string | number;
}

export interface SchemaProperty {
	title: string;
	type: 'string' | 'number' | 'object';
	description?: string;
	enum?: string[];
	anyOf?: SchemaProperty[];
	properties?: SchemaPropertyMap;
}

export interface SchemaPropertyMap {
	[key: string]: SchemaProperty;
}

export interface FieldsProps {
	formData: SchemaForm;
	schema: { properties: SchemaPropertyMap };
	onChange: (data: any) => void;
}

export interface CustomFieldProps {
	formData: SchemaForm;
	schema: SchemaPropertyMap;
	onChange: (value: string) => void;
}

export const getUpdatedForm = (form: SchemaForm, keyList: string[], value: string) => {
	if (keyList.length === 0) {
		return form;
	}

	const [currentKey, ...restKeys] = keyList;
	if (!(currentKey in form) || typeof form[currentKey] !== 'object') {
		form[currentKey] = {};
	}

	if (restKeys.length === 0) {
		const numValue = Number(value);
		form[currentKey] = value === '' || Number.isNaN(numValue) ? value : numValue;
		return form;
	}

	getUpdatedForm(form[currentKey] as SchemaForm, restKeys, value);
	return form;
};

export const getCustomField = (fieldKey: string, customProps: CustomFieldProps) => {
	switch (fieldKey) {
		case 'curve_uls':
			return <MatlConc_curve_uls {...customProps} />;
		case 'curve_sls':
			return <MatlConc_curve_uls {...customProps} />;
		case 'points':
		case 'innerPolygon':
		case 'outerPolygon':
			return <PolygonField {...customProps} />;
		case 'lcom':
			return <Lcom_FiexedField {...customProps} />;
		case 'lcoms':
			return <LcomField {...customProps} />;
		default:
			return;
	}
};

export const renderField = (
	field: SchemaProperty,
	value: string,
	handleChange: (value: string) => void,
): ReactElement => {
	return (
		<div className={'field-content'}>
			<div className={'field-name'}>
				{field.title}
				{/*<div className={'field-description'}>{field.description}</div>*/}
			</div>
			{field.enum ? (
				<DropList
					width={'150px'}
					value={field.enum.findIndex((item) => item === value)}
					itemList={field.enum.map((enumKey, idx) => [enumKey, idx])}
					onChange={(event) => {
						const newValue = field.enum?.find((_, idx) => idx === Number(event.target.value));
						if (!newValue) return;
						handleChange(newValue);
					}}
				/>
			) : (
				<TextField
					value={value}
					placeholder={field.description}
					type={field.type === 'number' ? 'number' : 'text'}
					onChange={(event) => {
						handleChange(event.target.value);
					}}
				/>
			)}
		</div>
	);
};
