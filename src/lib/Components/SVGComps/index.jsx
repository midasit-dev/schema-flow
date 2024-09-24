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

export const SvgRightArrow = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M3.33789 7C5.06694 4.01099 8.29866 2 12.0001 2C17.5229 2 22.0001 6.47715 22.0001 12C22.0001 17.5228 17.5229 22 12.0001 22C8.29866 22 5.06694 19.989 3.33789 17M12 16L16 12M16 12L12 8M16 12H2'
			stroke='white'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgLeftArrow = () => (
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
			d='M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999'
			stroke='white'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</motion.svg>
);

export const SvgSearch = ({ isFocused }) => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z'
			stroke={isFocused ? 'black' : 'currentColor'}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgHome = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M9 21V13.6C9 13.0399 9 12.7599 9.109 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75993 12 10.04 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V21M2 9.5L11.04 2.72C11.3843 2.46181 11.5564 2.33271 11.7454 2.28294C11.9123 2.23902 12.0877 2.23902 12.2546 2.28295C12.4436 2.33271 12.6157 2.46181 12.96 2.72L22 9.5M4 8V17.8C4 18.9201 4 19.4802 4.21799 19.908C4.40974 20.2843 4.7157 20.5903 5.09202 20.782C5.51985 21 6.0799 21 7.2 21H16.8C17.9201 21 18.4802 21 18.908 20.782C19.2843 20.5903 19.5903 20.2843 19.782 19.908C20 19.4802 20 18.9201 20 17.8V8L13.92 3.44C13.2315 2.92361 12.8872 2.66542 12.5091 2.56589C12.1754 2.47804 11.8246 2.47804 11.4909 2.56589C11.1128 2.66542 10.7685 2.92361 10.08 3.44L4 8Z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgDropdown = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M6 9L12 15L18 9'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgClockRewind = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M22.7 13.5L20.7005 11.5L18.7 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3019 3 18.1885 4.77814 19.7545 7.42909M12 7V12L15 14'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgLogin = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M15 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11985 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H15M10 7L15 12M15 12L10 17M15 12L3 12'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgLogOut = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgLayers = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M2 12.0001L11.6422 16.8212C11.7734 16.8868 11.839 16.9196 11.9078 16.9325C11.9687 16.9439 12.0313 16.9439 12.0922 16.9325C12.161 16.9196 12.2266 16.8868 12.3578 16.8212L22 12.0001M2 17.0001L11.6422 21.8212C11.7734 21.8868 11.839 21.9196 11.9078 21.9325C11.9687 21.9439 12.0313 21.9439 12.0922 21.9325C12.161 21.9196 12.2266 21.8868 12.3578 21.8212L22 17.0001M2 7.00006L11.6422 2.17895C11.7734 2.11336 11.839 2.08056 11.9078 2.06766C11.9687 2.05622 12.0313 2.05622 12.0922 2.06766C12.161 2.08056 12.2266 2.11336 12.3578 2.17895L22 7.00006L12.3578 11.8212C12.2266 11.8868 12.161 11.9196 12.0922 11.9325C12.0313 11.9439 11.9687 11.9439 11.9078 11.9325C11.839 11.9196 11.7734 11.8868 11.6422 11.8212L2 7.00006Z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgBell = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgPlus = ({ isHovered }) => {
	return (
		<motion.svg
			width='100%'
			height='100%'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<motion.path
				initial={{ stroke: 'gray' }}
				animate={{
					stroke: isHovered ? '#000' : 'gray',
				}}
				transition={{ duration: 0.3 }}
				d='M12 5V19M5 12H19'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</motion.svg>
	);
};

export const SvgSave = () => (
	<svg
		width='100%'
		height='100%'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M7 3V6.4C7 6.96005 7 7.24008 7.10899 7.45399C7.20487 7.64215 7.35785 7.79513 7.54601 7.89101C7.75992 8 8.03995 8 8.6 8H15.4C15.9601 8 16.2401 8 16.454 7.89101C16.6422 7.79513 16.7951 7.64215 16.891 7.45399C17 7.24008 17 6.96005 17 6.4V4M17 21V14.6C17 14.0399 17 13.7599 16.891 13.546C16.7951 13.3578 16.6422 13.2049 16.454 13.109C16.2401 13 15.9601 13 15.4 13H8.6C8.03995 13 7.75992 13 7.54601 13.109C7.35785 13.2049 7.20487 13.3578 7.10899 13.546C7 13.7599 7 14.0399 7 14.6V21M21 9.32548V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H14.6745C15.1637 3 15.4083 3 15.6385 3.05526C15.8425 3.10425 16.0376 3.18506 16.2166 3.29472C16.4184 3.4184 16.5914 3.59135 16.9373 3.93726L20.0627 7.06274C20.4086 7.40865 20.5816 7.5816 20.7053 7.78343C20.8149 7.96237 20.8957 8.15746 20.9447 8.36154C21 8.59171 21 8.8363 21 9.32548Z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export const SvgEdit = ({ isHovered }) => {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M18 10L14 6M2.49997 21.5L5.88434 21.124C6.29783 21.078 6.50457 21.055 6.69782 20.9925C6.86926 20.937 7.03242 20.8586 7.18286 20.7594C7.35242 20.6475 7.49951 20.5005 7.7937 20.2063L21 7C22.1046 5.89543 22.1046 4.10457 21 3C19.8954 1.89543 18.1046 1.89543 17 3L3.7937 16.2063C3.49952 16.5005 3.35242 16.6475 3.24061 16.8171C3.1414 16.9676 3.06298 17.1307 3.00748 17.3022C2.94493 17.4954 2.92195 17.7021 2.87601 18.1156L2.49997 21.5Z'
				stroke={isHovered ? 'black' : 'gray'}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
};

export const SvgLoginBackground = () => {
	return (
		<svg viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
			<defs>
				<radialGradient id='Gradient1' cx='50%' cy='50%' fx='0.441602%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='34s'
						values='0%;3%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(255, 0, 255, 1)'></stop>
					<stop offset='100%' stopColor='rgba(255, 0, 255, 0)'></stop>
				</radialGradient>
				<radialGradient id='Gradient2' cx='50%' cy='50%' fx='2.68147%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='23.5s'
						values='0%;3%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(255, 255, 0, 1)'></stop>
					<stop offset='100%' stopColor='rgba(255, 255, 0, 0)'></stop>
				</radialGradient>
				<radialGradient id='Gradient3' cx='50%' cy='50%' fx='0.836536%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='21.5s'
						values='0%;3%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(0, 255, 255, 1)'></stop>
					<stop offset='100%' stopColor='rgba(0, 255, 255, 0)'></stop>
				</radialGradient>
				<radialGradient id='Gradient4' cx='50%' cy='50%' fx='4.56417%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='23s'
						values='0%;5%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(0, 255, 0, 1)'></stop>
					<stop offset='100%' stopColor='rgba(0, 255, 0, 0)'></stop>
				</radialGradient>
				<radialGradient id='Gradient5' cx='50%' cy='50%' fx='2.65405%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='24.5s'
						values='0%;5%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(0,0,255, 1)'></stop>
					<stop offset='100%' stopColor='rgba(0,0,255, 0)'></stop>
				</radialGradient>
				<radialGradient id='Gradient6' cx='50%' cy='50%' fx='0.981338%' fy='50%' r='.5'>
					<animate
						attributeName='fx'
						dur='25.5s'
						values='0%;5%;0%'
						repeatCount='indefinite'
					></animate>
					<stop offset='0%' stopColor='rgba(255,0,0, 1)'></stop>
					<stop offset='100%' stopColor='rgba(255,0,0, 0)'></stop>
				</radialGradient>
			</defs>
			<rect x='0' y='0' width='100%' height='100%' fill='url(#Gradient6)'>
				<animate attributeName='x' dur='25s' values='-25%;0%;-25%' repeatCount='indefinite' />
				<animate attributeName='y' dur='26s' values='0%;-25%;0%' repeatCount='indefinite' />
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='360 50 50'
					to='0 50 50'
					dur='19s'
					repeatCount='indefinite'
				/>
			</rect>
			<rect
				x='13.744%'
				y='1.18473%'
				width='100%'
				height='100%'
				fill='url(#Gradient1)'
				transform='rotate(334.41 50 50)'
			>
				<animate attributeName='x' dur='20s' values='25%;0%;25%' repeatCount='indefinite'></animate>
				<animate attributeName='y' dur='21s' values='0%;25%;0%' repeatCount='indefinite'></animate>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='0 50 50'
					to='360 50 50'
					dur='7s'
					repeatCount='indefinite'
				></animateTransform>
			</rect>
			<rect
				x='-2.17916%'
				y='35.4267%'
				width='100%'
				height='100%'
				fill='url(#Gradient2)'
				transform='rotate(255.072 50 50)'
			>
				<animate
					attributeName='x'
					dur='23s'
					values='-25%;0%;-25%'
					repeatCount='indefinite'
				></animate>
				<animate attributeName='y' dur='24s' values='0%;50%;0%' repeatCount='indefinite'></animate>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='0 50 50'
					to='360 50 50'
					dur='12s'
					repeatCount='indefinite'
				></animateTransform>
			</rect>
			<rect
				x='9.00483%'
				y='14.5733%'
				width='100%'
				height='100%'
				fill='url(#Gradient3)'
				transform='rotate(139.903 50 50)'
			>
				<animate attributeName='x' dur='25s' values='0%;25%;0%' repeatCount='indefinite'></animate>
				<animate attributeName='y' dur='12s' values='0%;25%;0%' repeatCount='indefinite'></animate>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='360 50 50'
					to='0 50 50'
					dur='9s'
					repeatCount='indefinite'
				></animateTransform>
			</rect>
		</svg>
	);
};
