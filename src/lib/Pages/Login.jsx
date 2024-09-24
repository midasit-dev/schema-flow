import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

// recoil
import { useSetRecoilState } from 'recoil';
import { TokenState, AccState } from '../RecoilAtom/recoilHomeState';

import preval from 'preval.macro';

// components
import { SvgLoginBackground } from '../Components/SVGComps';

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

function QueryClientCleaner() {
	const queryClient = useQueryClient();
	React.useEffect(() => {
		queryClient.cancelQueries();
		queryClient.clear();
	}, [queryClient]);
	return null;
}

export default function Login({ clearQueryClient = false }) {
	// const { darkMode } = useNightSight();
	const [id, setId] = React.useState('');
	const [pwd, setPwd] = React.useState('');
	const [isFetching, setIsFetching] = React.useState(false);
	const [isLoginFailed, setIsLoginFailed] = React.useState(false);
	const [isLoginSuccessed, setIsLoginSuccessed] = React.useState(false);
	const [dotText, setDotText] = React.useState('.');
	const [loginMessage, setLoginMessage] = React.useState('Logging in');
	const [showProgressMessage, setShowProgressMessage] = React.useState(false);
	usePointerGlow();
	const navigate = useNavigate();
	const setToken = useSetRecoilState(TokenState);
	const setAcc = useSetRecoilState(AccState);

	// change text like ".", "..", "..."  while fetching
	React.useEffect(() => {
		if (isFetching) {
			const interval = setInterval(() => {
				setDotText((prev) => {
					if (prev === '....') {
						return '.';
					}
					return prev + '.';
				});
			}, 500);
			return () => clearInterval(interval);
		} else {
			if (isLoginFailed) {
				setLoginMessage('Login Failed');
			} else if (isLoginSuccessed) {
				setLoginMessage('Login Successed');
			}

			const interval = setInterval(() => {
				setShowProgressMessage(false);
				setLoginMessage('Logging in');
				if (isLoginSuccessed) {
					navigate(-1);
				}
			}, 2000);
			return () => clearInterval(interval);
		}
	}, [isFetching]);

	React.useEffect(() => {
		if (isFetching) {
			setLoginMessage('Logging in' + dotText);
		}
	}, [dotText]);

	const onClickLogin = React.useCallback(async () => {
		setIsFetching(true);
		setShowProgressMessage(true);
		const res = await fetch('https://members.midasuser.com/auth/api/v1/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: id, password: pwd }),
		});
		if (res.ok) {
			const data = await res.json();
			setToken(data.token);
			setAcc(JSON.stringify({ id, pwd }));

			setIsLoginSuccessed(true);
			setIsLoginFailed(false);
		} else {
			setToken('');
			setAcc('');

			setIsLoginSuccessed(false);
			setIsLoginFailed(true);
		}

		const interval = setInterval(() => {
			setIsFetching(false);
		}, 2000);
		return () => clearInterval(interval);
	}, [id, pwd]);

	return (
		<div
			style={{
				width: '100vw',
				heigt: '100vh',
				overflow: 'hidden',
			}}
			key='FlowLogin'
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					onClickLogin();
				}
			}}
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
						<SvgLoginBackground key='chat-login-background' />
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
						<div
							style={{
								height: '100%',
								width: '100%',
								display: 'inherit',
								alignItems: 'center',
								justifyContent: 'center',
								backdropFilter: 'blur(20px)',
								backgroundColor: 'rgba(255, 255, 255, 0.5)',
								borderRadius: '10px',
							}}
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
									{showProgressMessage ? (
										<div
											className={`login-message-container ${
												loginMessage === 'Login Failed'
													? 'login-failed'
													: loginMessage === 'Login Successed'
													? 'login-successed'
													: ''
											}`}
										>
											{loginMessage}
										</div>
									) : (
										<>
											<button
												className='login-button back'
												onClick={() => {
													navigate(-1);
												}}
											>
												Back
											</button>
											<button className='login-button login' onClick={onClickLogin}>
												Login
											</button>
										</>
									)}
								</motion.div>
							</div>
						</div>
					</Stack>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
