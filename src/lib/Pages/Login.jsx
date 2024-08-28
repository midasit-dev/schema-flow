import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

import { useNightSight } from '../Components/Login/useThemeSetting';

import rss from 'react-secure-storage';

import preval from 'preval.macro';

// css
import './Login.css';

/**
 * Tiny hook that you can use where you need it
 */
const usePointerGlow = () => {
	const [status, setStatus] = React.useState(null);
	React.useEffect(() => {
		const syncPointer = ({ x: pointerX, y: pointerY }) => {
			const x = pointerX.toFixed(2);
			const y = pointerY.toFixed(2);
			const xp = (pointerX / window.innerWidth).toFixed(2);
			const yp = (pointerY / window.innerHeight).toFixed(2);
			document.documentElement.style.setProperty('--x', x);
			document.documentElement.style.setProperty('--xp', xp);
			document.documentElement.style.setProperty('--y', y);
			document.documentElement.style.setProperty('--yp', yp);
			setStatus({ x, y, xp, yp });
		};
		document.body.addEventListener('pointermove', syncPointer);
		return () => {
			document.body.removeEventListener('pointermove', syncPointer);
		};
	}, []);
	return [status];
};

function LoginBg() {
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
}

function QueryClientCleaner() {
	const queryClient = useQueryClient();
	React.useEffect(() => {
		queryClient.cancelQueries();
		queryClient.clear();
	}, [queryClient]);
	return null;
}

export default function Login({ clearQueryClient = false }) {
	const { darkMode } = useNightSight();
	const [id, setId] = React.useState('');
	const [pwd, setPwd] = React.useState('');
	usePointerGlow();
	const navigate = useNavigate();

	return (
		<div
			style={{
				width: '100vw',
				heigt: '100vh',
				overflow: 'hidden',
			}}
			key='chatLogin'
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{
					duration: 0.5,
					type: 'easeInOut',
				}}
			>
				{clearQueryClient && <QueryClientCleaner />}
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, type: 'easeInOut' }}
					>
						<LoginBg key='chat-login-background' />
					</motion.div>
				</AnimatePresence>
				<AnimatePresence mode='popLayout'>
					<Stack
						position='absolute'
						top={0}
						bottom={0}
						left={0}
						right={0}
						width='30rem'
						height='25rem'
						margin='auto'
						direction='column'
					>
						<Paper
							sx={{
								height: '100%',
								width: '100%',
								display: 'inherit',
								alignItems: 'center',
								justifyContent: 'center',
								backdropFilter: 'blur(20px)',
								backgroundColor:
									darkMode.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
							}}
							elevation={0}
							data-glow
						>
							<div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
								<motion.div>
									<div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
										<Typography variant='h3'>Flow Login</Typography>
									</div>
									<div style={{ height: '1rem' }} />
									<Divider flexItem />
									<div style={{ height: '0.8rem' }} />
									<Typography variant='caption'>
										Release date{' '}
										{`${preval`module.exports = new Date().toLocaleString("ko-kr", { timeZone : "Asia/Seoul" });`}`}
									</Typography>
									<div style={{ height: '2.5rem' }} />
								</motion.div>
								<motion.div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
									{/* <SsoValidator buttonProps={{ fullWidth: true }} /> */}
									<input
										className='login-input'
										type='email'
										value={id}
										onChange={(e) => setId(e.target.value)}
										placeholder='ID'
									/>
									<input
										className='login-input'
										type='password'
										value={pwd}
										onChange={(e) => setPwd(e.target.value)}
										placeholder='PASSWORD'
									/>
								</motion.div>
								<motion.div
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: '25px',
										gap: '20px',
									}}
								>
									<button className='login-button back' onClick={() => {navigate(-1)}}>
										Back
									</button>
									<button
										className='login-button login'
										onClick={() => {
											fetch('https://members.midasuser.com/auth/api/v1/login', {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({ email: id, password: pwd }),
											})
												.then((res) => res.json())
												.then((res) => {
													rss.setItem('token', res.token);
													rss.setItem('acc', JSON.stringify({ id, pwd }));
													navigate('/home');
												})
												.catch((e) => console.error(e));
												
										}}
									>
										Login
									</button>
								</motion.div>
							</div>
						</Paper>
					</Stack>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
