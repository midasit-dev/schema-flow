import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Icon = (props) => {
	const { SVG, onClickHandler } = props;

	return (
		<div
			style={{
				width: '24px',
				height: '24px',
				backgroundColor: 'white',
				cursor: 'pointer',
				position: 'fixed',
				top: '5px',
				left: '5px',
				zIndex: '1000',
				padding: '10px',
				borderRadius: '50%',
				border: '1px solid #c1c1c3',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			onClick={() => onClickHandler()}
		>
			{SVG}
		</div>
	);
};

export const Svglist = () => (
	<motion.svg
		initial={{ opacity: 0, scale: 1 }}
		animate={{ opacity: 1, scale: 1 }}
		exit={{ opacity: 0, scale: 0 }}
		transition={{ duration: 0.2 }}
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M21 5L10 5M21 19L10 19M21 12L10 12M6 5C6 5.82843 5.32843 6.5 4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5ZM6 19C6 19.8284 5.32843 20.5 4.5 20.5C3.67157 20.5 3 19.8284 3 19C3 18.1716 3.67157 17.5 4.5 17.5C5.32843 17.5 6 18.1716 6 19ZM6 12C6 12.8284 5.32843 13.5 4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12Z'
			stroke='black'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</motion.svg>
);

// Svgminimize 컴포넌트에 motion 적용
export const Svgminimize = () => (
	<motion.svg
		initial={{ opacity: 0, scale: 1 }}
		animate={{ opacity: 1, scale: 1 }}
		exit={{ opacity: 0, scale: 0 }}
		transition={{ duration: 0.2 }}
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='black'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M2.99988 8H3.19988C4.88004 8 5.72011 8 6.36185 7.67302C6.92634 7.3854 7.38528 6.92646 7.6729 6.36197C7.99988 5.72024 7.99988 4.88016 7.99988 3.2V3M2.99988 16H3.19988C4.88004 16 5.72011 16 6.36185 16.327C6.92634 16.6146 7.38528 17.0735 7.6729 17.638C7.99988 18.2798 7.99988 19.1198 7.99988 20.8V21M15.9999 3V3.2C15.9999 4.88016 15.9999 5.72024 16.3269 6.36197C16.6145 6.92646 17.0734 7.3854 17.6379 7.67302C18.2796 8 19.1197 8 20.7999 8H20.9999M15.9999 21V20.8C15.9999 19.1198 15.9999 18.2798 16.3269 17.638C16.6145 17.0735 17.0734 16.6146 17.6379 16.327C18.2796 16 19.1197 16 20.7999 16H20.9999'
			stroke='black'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</motion.svg>
);

export const SvgCheckCircle = ({ color = 'white', isVisible }) => {
	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		setIsMounted(isVisible);
	}, [isVisible]);

	// 모션을 위한 초기 경로 길이 설정
	const draw = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: {
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 1, delay: 0.5 },
				opacity: { duration: 0.1, delay: 0.5 },
			},
		},
		exit: {
			pathLength: 0,
			opacity: 0,
			transition: {
				pathLength: { duration: 1 },
				opacity: { duration: 1 },
			},
		},
	};

	return (
		<AnimatePresence>
			{isMounted && (
				<motion.svg
					key='SvgCheckCircle'
					width='100%'
					height='100%'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					initial='hidden'
					animate='visible'
					exit='exit'
				>
					<motion.path
						key='SvgCheckCirclePath'
						d='M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01'
						stroke={color}
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						variants={draw}
					/>
				</motion.svg>
			)}
		</AnimatePresence>
	);
};

export const SvgClose = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M18 6L6 18M6 6L18 18'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);
