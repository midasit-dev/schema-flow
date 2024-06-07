import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { type PropComponentProps, usePropComponent } from './ToPropComponents';

const itemVariants = {
	open: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
	closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const SvgExpand = () => {
	return (
		<div className='w-4 h-4'>
			<svg
				width='100%'
				height='100%'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16'
					stroke='#fff'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</div>
	);
};

const App = (props: PropComponentProps<string>) => {
	const { type, name, value, hookType } = props;
	const { localValue, setLocalValue, updateGlobalValue } = usePropComponent(
		type,
		name,
		value,
		hookType,
	);

	const [isOpen, setOpen] = React.useState(false);

	const updateInputValue = useCallback(
		(e: any) => {
			const curValue = e.target.value;
			if (curValue !== undefined) {
				setLocalValue(e.target.value);
				updateGlobalValue((prev: any) => ({
					...prev,
					props: {
						...prev.props,
						[name]: e.target.value,
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
			<motion.nav initial={false} animate={isOpen ? 'open' : 'closed'} className='relative w-44'>
				<motion.div
					className='w-full h-auto py-[6px] px-4 rounded-md box-border space-x-10 flex flex-row items-center text-white text-xs'
					animate={{ backgroundColor: bgColor }}
				>
					<input
						className='p-0 w-full rounded-md focus:outline-none bg-transparent text-white text-xs placeholder-gray-100 caret-pg-blue-medium'
						placeholder={localValue}
						value={localValue}
						onChange={(e: any) => setLocalValue(e.target.value)}
						type='text'
						onFocus={whenInputFocusIn}
						onBlur={(e: any) => {
							whenInputFocusOut();
							updateInputValue(e);
						}}
					/>
					<motion.div
						whileTap={{ scale: 0.97 }}
						onClick={() => setOpen(!isOpen)}
						variants={{
							open: { rotate: 180 },
							closed: { rotate: 0 },
						}}
						transition={{ duration: 0.2 }}
						style={{ originY: 0.5 }}
						className='items-center cursor-pointer'
					>
						<SvgExpand />
					</motion.div>
				</motion.div>
				<motion.div
					variants={{
						open: {
							clipPath: 'inset(0% 0% 0% 0% round 6px)',
							transition: {
								type: 'spring',
								bounce: 0,
								duration: 0.7,
								delayChildren: 0.3,
								staggerChildren: 0.05,
							},
						},
						closed: {
							clipPath: 'inset(10% 50% 90% 50% round 6px)',
							transition: {
								type: 'spring',
								bounce: 0,
								duration: 0.3,
							},
						},
					}}
					style={{
						pointerEvents: isOpen ? 'auto' : 'none',
						position: 'absolute',
						top: 0,
						left: hookType === 'Add' ? 188 : hookType === 'Modify' ? -312 : 0,
					}}
					className='bg-pg-black-medium bg-opacity-90 px-4 py-3  overflow-hidden box-border space-y-3 w-[300px] h-[84px] text-white text-xs'
				>
					<motion.textarea
						rows={3}
						variants={itemVariants}
						className='p-0 w-full rounded-md focus:outline-none bg-transparent text-white text-sm placeholder-gray-100 caret-pg-blue-medium'
						placeholder={localValue}
						value={localValue}
						onChange={(e: any) => setLocalValue(e.target.value)}
						onBlur={updateInputValue}
						onKeyDown={(e: any) => {
							if (e.key === 'Escape') {
								setOpen(false);
							}

							if (e.key === 'Enter') {
								setOpen(false);
								updateInputValue(e);
							}
						}}
					/>
				</motion.div>
			</motion.nav>
		</div>
	);
};

export default App;
