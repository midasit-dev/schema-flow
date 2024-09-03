import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';

import Home from './lib/Pages/Home';
import SchemaFlow from './lib/Pages/SchemaFlow';
import Intro from './lib/Pages/Intro';
import Login from './lib/Pages/Login';

import NightSightProvider from './lib/Components/Login/useThemeSetting';

function FlowRoute() {
	return (
		<Routes>
			<Route path='home' element={<Home />} />
			<Route path='intro' element={<Intro />} />
			<Route path='login' element={<Login />} />
			<Route path='*' element={<SchemaFlow />} />
		</Routes>
	);
}

function FlowRouteWrapper() {
	const location = useLocation();

	return (
		<Routes location={location}>
			<Route path={`${process.env.REACT_APP_PUBLIC_URL}/*`} element={<FlowRoute />} />
		</Routes>
	);
}

export default function FlowRoot() {
	return (
		<BrowserRouter>
			<NightSightProvider>
				<FlowRouteWrapper />
			</NightSightProvider>
		</BrowserRouter>
	);
}
