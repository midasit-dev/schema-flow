import { useCallback, useState } from 'react';
import { type PropComponentProps, usePropComponent } from './ToPropComponents';
import { motion } from 'framer-motion';

const App = (props: PropComponentProps<boolean>): JSX.Element => {
	const { type, name, value, hookType } = props;
	const { localValue, setLocalValue, updateGlobalValue } = usePropComponent(
		type,
		name,
		value,
		hookType,
	);

	const updateSwitchValue = useCallback(
		(cur: boolean) => {
			setLocalValue(cur);
			updateGlobalValue((prev: any) => ({
				...prev,
				props: {
					...prev.props,
					[name]: cur,
				},
			}));
		},
		[name, setLocalValue, updateGlobalValue],
	);

	const [isOn, setIsOn] = useState(localValue);
	const toggleSwitch = useCallback(() => {
		const cur = !isOn;
		setIsOn(cur);
		updateSwitchValue(cur);
	}, [isOn, setIsOn, updateSwitchValue]);

	return (
		<div className='w-full justify-between items-center flex flex-row relative'>
			<p className='text-gray-600 text-xs'>{name}</p>
			<div
				className='absolute top-[14px] right-[6px] w-6 h-0 z-0'
				style={{
					borderTop: isOn ? '1px solid #62baf3' : '1px solid #394150',
				}}
			/>
			<div
				className='w-10 h-[28px] bg-transparent bg-opacity-40 flex rounded-md cursor-pointer p-1'
				onClick={toggleSwitch}
				style={{ justifyContent: isOn ? 'flex-end' : 'flex-start' }}
			>
				<motion.div
					className='w-5 h-5 rounded-[20px] z-10'
					layout
					transition={{ type: 'spring', stiffness: 700, damping: 30 }}
					animate={{
						backgroundColor: isOn ? '#62baf3' : '#394150',
					}}
				/>
			</div>
		</div>
	);
};

export default App;
