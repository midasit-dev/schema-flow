import React from 'react';
import { Routes, Route, BrowserRouter, useLocation, Navigate } from 'react-router-dom';

// pages
import Home from './lib/Pages/Home';
import SchemaFlow from './lib/Pages/SchemaFlow';
import Intro from './lib/Pages/Intro';
import Login from './lib/Pages/Login';

import { IsSessionValid, GetToken } from './lib/Common/Login/SessionChecker';

// recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { TokenState, AccState } from './lib/RecoilAtom/recoilHomeState';
import { set } from 'lodash';

function FlowRoute() {
	return (
		<Routes>
			<Route path='home' element={<Home />} />
			<Route path='intro' element={<Intro />} />
			<Route path='login' element={<Login />} />
			<Route path='flow/*' element={<SchemaFlow />} />

			<Route path='*' element={<Navigate to='./home' />} />
		</Routes>
	);
}

function FlowRouteWrapper() {
	const location = useLocation();
	const [token, setToken] = useRecoilState(TokenState);
	const acc = useRecoilValue(AccState);

	React.useEffect(() => {
		async function checkValidation() {
			const result = await IsSessionValid(token);
			if (result === 'token is empty') {
				console.error(result);
				await getNewToken();
			} else if (result === false) {
				console.error('token is invalid');
				await getNewToken();
			}
		}
		async function getNewToken() {
			const result = await GetToken(acc);
			if (result === 'acc is empty' || result === 'token issuance failed') {
				console.error(result);
				setToken('');
			} else {
				setToken(result);
			}
		}
		checkValidation();
	}, []);

	return (
		<Routes location={location}>
			<Route path={`${process.env.REACT_APP_PUBLIC_URL}/*`} element={<FlowRoute />} />
		</Routes>
	);
}

export default function FlowRoot() {
	return (
		<BrowserRouter>
			<FlowRouteWrapper />
		</BrowserRouter>
	);
}
