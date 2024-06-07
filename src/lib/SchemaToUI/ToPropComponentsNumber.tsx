import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { type PropComponentProps, usePropComponent } from './ToPropComponents';
import styled from 'styled-components';

const StyledInput = styled.input`
	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	& {
		-moz-appearance: textfield;
	}
`;

const App = (props: PropComponentProps<number>) => {
	const { type, name, value, hookType } = props;
	const { localValue, setLocalValue, updateGlobalValue } = usePropComponent(
		type,
		name,
		value,
		hookType,
	);

	const updateInputValue = useCallback(
		(e: any) => {
			const curValue = e.target.value;
			if (curValue !== '' && curValue !== undefined) {
				setLocalValue(Number(curValue));
				updateGlobalValue((prev: any) => ({
					...prev,
					props: {
						...prev.props,
						[name]: Number(curValue),
					},
				}));
			}
		},
		[name, setLocalValue, updateGlobalValue],
	);

	const [bgColor, setBgColor] = React.useState('rgb(55, 65, 81)');
	const whenInputFocusIn = useCallback(() => setBgColor('#0786c8'), []);
	const whenInputFocusOut = useCallback(() => setBgColor('rgb(55, 65, 81)'), []);

	return (
		<div className='w-full flex flex-row justify-between items-center'>
			<p className='text-gray-600 text-xs'>{name}</p>
			<motion.nav className='relative w-44'>
				<motion.div
					className='w-full h-auto py-[6px] px-4 rounded-md box-border space-x-10 flex flex-row items-center text-white text-xs'
					animate={{ backgroundColor: bgColor }}
				>
					<StyledInput
						className='p-0 w-full rounded-md focus:outline-none bg-transparent text-white text-xs placeholder-gray-100 caret-pg-blue-medium'
						placeholder={localValue}
						value={localValue}
						onChange={(e: any) => setLocalValue(e.target.value)}
						type='number'
						min={0}
						step={1}
						onFocus={whenInputFocusIn}
						onBlur={(e: any) => {
							whenInputFocusOut();
							updateInputValue(e);
						}}
					/>
				</motion.div>
			</motion.nav>
		</div>
	);
};

export default App;
