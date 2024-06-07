import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Layer } from '../../../../playground/src/lib/Common/types';
import Moaui, { type CustomUnionType } from '@midasit-dev/moaui';
import {
	PropComponentLayerAddValueState,
	PropComponentLayerModifyValueState,
} from '../../../../playground/src/lib/Layout/recoilState';
import ToPropComponentsArray from './ToPropComponentsArray';
import ToPropComponentsUnion from './ToPropComponentsUnion';
import ToPropComponentsString from './ToPropComponentsString';
import ToPropComponentsBoolean from './ToPropComponentsBoolean';
import ToPropComponentsNumber from './ToPropComponentsNumber';

export interface PropComponentProps<T> {
	type: string;
	name: string;
	value: T;
	hookType: 'Add' | 'Modify';
}

export const usePropComponent = (type: string, name: string, value: any, hookType: string) => {
	const [localValue, setLocalValue] = useState(value);
	useEffect(() => setLocalValue(value), [value]);

	const [, setAddValue] = useRecoilState(PropComponentLayerAddValueState);
	const [, setModifyValue] = useRecoilState(PropComponentLayerModifyValueState);

	let setValue: any = null;
	if (hookType === 'Add') setValue = setAddValue;
	else if (hookType === 'Modify') setValue = setModifyValue;
	else console.error('hookType is not valid');

	//변경 될 때 마다 Add State에 추가해둠.
	useEffect(() => {
		setValue((prev: Layer) => ({
			...prev,
			props: {
				...prev.props,
				[name]: value,
			},
		}));
	}, [setValue, type, name, value]);

	return {
		localValue,
		setLocalValue,
		updateGlobalValue: setValue,
	};
};

const ToPropComponent = (props: PropComponentProps<any>): JSX.Element => {
	const { type, name, value, hookType } = props;

	//function등과 같이 아직 global 데이터를 업데이트하지 않는 변수들은 이곳에 들어올 수 있다.
	if (value === undefined) return <></>;

	if ((value as CustomUnionType).isUnion) {
		return <ToPropComponentsUnion type={type} name={name} value={value} hookType={hookType} />;
	} else if (value instanceof Array) {
		return <ToPropComponentsArray type={type} name={name} value={value} hookType={hookType} />;
	} else if (value instanceof Map) {
		return <ToPropComponentMap type={type} name={name} value={value} hookType={hookType} />;
	} else {
		//원시 타입
		switch (typeof value) {
			case 'function':
				return (
					<ToPropComponentFunction type={type} name={name} value={value} hookType={hookType} />
				);
			case 'string':
				return <ToPropComponentsString type={type} name={name} value={value} hookType={hookType} />;
			case 'boolean':
				return (
					<ToPropComponentsBoolean type={type} name={name} value={value} hookType={hookType} />
				);
			case 'number':
				return <ToPropComponentsNumber type={type} name={name} value={value} hookType={hookType} />;
			case 'object':
				return <ToPropComponentObject type={type} name={name} value={value} hookType={hookType} />;
			default:
				return <ToPropComponentDefault type={type} name={name} value={value} hookType={hookType} />;
		}
	}
};

interface ToPropComponentsProps {
	componentType: string;
	customProps?: any;
	customHookType: PropComponentProps<any>['hookType'];
}

const ToPropComponents = (props: ToPropComponentsProps): JSX.Element => {
	const { componentType, customProps, customHookType } = props;

	const [options, setOptions] = useState<any[][]>([]);
	useEffect(() => {
		if (!componentType) return;

		const SampleProps = Moaui[(componentType + 'Sample') as keyof typeof Moaui];
		if (customProps) {
			//Mod 대화상자 오픈 시 사용
			//라이브러리 Property에서 Union Type인지 검사 한 후,
			//Union Type이면 defaultValue에 customProps에서 넘어온 값을 채워준다.
			let modCustomProps = { ...customProps };
			for (const [key, value] of Array.from(Object.entries(SampleProps))) {
				const unknownValue: unknown = value;
				if ((unknownValue as CustomUnionType).isUnion) {
					const unionValue = unknownValue as CustomUnionType;
					unionValue.defaultValue = customProps[key];
					modCustomProps[key] = unionValue;
				}
			}

			const sortedKeys = Object.keys(SampleProps);
			const modSortedCustomPropsArray = sortedKeys.map((key: string) => [key, modCustomProps[key]]);
			setOptions(modSortedCustomPropsArray);
		} else {
			//Add 대화상자 오픈 시 사용
			const playgroundProps = SampleProps;
			setOptions(Array.from(Object.entries(playgroundProps)));
		}
	}, [customProps, componentType]);

	return (
		<div className='w-full justify-between items-center space-y-2'>
			{options.map(([name, value], index: number) => {
				return (
					<ToPropComponent
						key={componentType + index}
						type={componentType}
						name={name}
						value={value}
						hookType={customHookType}
					/>
				);
			})}
		</div>
	);
};

export default ToPropComponents;

//이 아래는 변경이 필요합니다.
const ToPropComponentMap = (props: PropComponentProps<Map<any, any>>): JSX.Element => {
	return <></>;

	// //추가하는 것 부터 조금 고민이 필요해보인다 =_=
	// const { name, value } = props;
	// // const callbackValue = useCallback(() => value, [value]);
	// // const { localValue, } = usePropComponent(type, name, callbackValue);
	// return (
	// 	<GuideBox width='100%' row horSpaceBetween verCenter opacity={0.5}>
	// 		<Typography variant='body1'>*Map {name}</Typography>
	// 		<TextField width='100px' value={value.toString()} disabled />
	// 	</GuideBox>
	// );
};

const ToPropComponentFunction = (props: PropComponentProps<Function>): JSX.Element => {
	return <></>;

	// //추가하는 것 부터 조금 고민이 필요해보인다 =_=
	// const { name, value } = props;
	// // const { localValue, } = usePropComponent(type, name, value, hookType);
	// return (
	// 	<GuideBox width='100%' row horSpaceBetween verCenter opacity={0.5}>
	// 		<Typography variant='body1'>{name}</Typography>
	// 		<TextField width='100px' value={value.toString()} disabled />
	// 	</GuideBox>
	// );
};

const ToPropComponentObject = (props: PropComponentProps<object>): JSX.Element => {
	return <></>;

	// const { name, value } = props;
	// // const { localValue, } = usePropComponent(type, name, value, hookType);
	// return (
	// 	<GuideBox width='100%' row horSpaceBetween verCenter opacity={0.5}>
	// 		<Typography variant='body1'>*object {name}</Typography>
	// 		<TextField width='100px' value={JSON.stringify(value)} disabled />
	// 	</GuideBox>
	// );
};

const ToPropComponentDefault = (props: PropComponentProps<any>): JSX.Element => {
	return <>Default</>;

	// const { name, value } = props;
	// return (
	// 	<GuideBox width='100%' row horSpaceBetween verCenter opacity={0.5}>
	// 		<Typography variant='body1'>*default {name}</Typography>
	// 		<TextField width='100px' value={JSON.stringify(value)} disabled />
	// 	</GuideBox>
	// );
};
