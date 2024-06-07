import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { type CustomUnionType } from '@midasit-dev/moaui';
import { usePropComponent, PropComponentProps } from './ToPropComponents';
import { zindex_components_panel_add_comp_properties } from '../../../../playground/src/lib/Common/zindex';

const itemVariants = {
	open: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 300, damping: 24 },
	},
	closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const SvgArrowDown = () => (
	<div className='w-4 h-4 rounded-md cursor-pointer'>
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M12 16L16 12M16 12L12 8M16 12H8M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	</div>
);

const App = (props: PropComponentProps<CustomUnionType>): JSX.Element => {
	const { type, name, value, hookType } = props;
	const { localValue, setLocalValue, updateGlobalValue } = usePropComponent(
		type,
		name,
		value.defaultValue,
		hookType,
	);

	const [isOpen, setOpen] = useState(false);

	return (
		<div
			className='w-full justify-between items-center flex flex-row'
			style={{ zIndex: zindex_components_panel_add_comp_properties }}
		>
			<p className='text-gray-600 text-xs'>{name}</p>
			<motion.nav initial={false} animate={isOpen ? 'open' : 'closed'} className='relative w-44'>
				<motion.button
					whileTap={{ scale: 0.97 }}
					onClick={() => setOpen(!isOpen)}
					className='w-full h-auto py-[6px] px-4 rounded-md shadow-lg box-border space-x-10 flex flex-row items-center bg-gray-700 text-white text-xs justify-between'
				>
					{localValue}
					<motion.div
						variants={{
							open: { rotate: 180 },
							closed: { rotate: 0 },
						}}
						transition={{ duration: 0.2 }}
						style={{ originY: 0.5 }}
					>
						<SvgArrowDown />
					</motion.div>
				</motion.button>
				<motion.ul
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
						left: hookType === 'Add' ? 188 : hookType === 'Modify' ? -188 : 0,
					}}
					className='bg-pg-black-medium bg-opacity-90 text-gray-400 text-xs px-4 py-3  overflow-hidden box-border space-y-3 w-full shadow-lg'
				>
					{value.values.map((option: string, index: number) => (
						<motion.li
							key={index}
							variants={itemVariants}
							className='cursor-pointer'
							whileHover={{ color: '#fff' }}
							whileTap={{ scale: 0.97 }}
							onClick={(e: any) => {
								setOpen(false);
								const curOption = e.target.innerText;
								setLocalValue(curOption);
								updateGlobalValue((prev: any) => ({
									...prev,
									props: {
										...prev.props,
										[name]: curOption,
									},
								}));
							}}
						>
							{option}
						</motion.li>
					))}
				</motion.ul>
			</motion.nav>
		</div>
	);
};

export default App;
