import React from 'react';
import { Routes, Route, BrowserRouter, useLocation, Navigate } from 'react-router-dom';

// pages
import Home from './lib/Pages/Home';
import SchemaFlow from './lib/Pages/SchemaFlow';
import Intro from './lib/Pages/Intro';
import Login from './lib/Pages/Login';

import { GetToken } from './lib/Common/Login/SessionChecker';

// recoil
import { useRecoilState } from 'recoil';
import { TokenState, AccState } from './lib/RecoilAtom/recoilHomeState';

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
	const [acc, setAcc] = useRecoilState(AccState);

	React.useEffect(() => {
		async function checkValidation() {
			await GetToken(token, setToken, acc, setAcc);
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
