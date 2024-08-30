import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';

import Home from './lib/Pages/Home';
import SchemaFlow from './lib/Pages/SchemaFlow';
import Intro from './lib/Pages/Intro';
import Login from './lib/Pages/Login';

import NightSightProvider, { useNightSight } from './lib/Components/Login/useThemeSetting';

function FlowRoute2() {
	return (
		<Routes>
			<Route path='home' element={<Home />} />
			<Route path='intro' element={<Intro />} />
			<Route path='login' element={<Login />} />
			<Route path='*' element={<SchemaFlow />} />
		</Routes>
	);
}

function FlowRoute() {
	const location = useLocation();

	return (
		<Routes location={location}>
			<Route path={`${process.env.REACT_APP_PUBLIC_URL}/*`} element={<FlowRoute2 />} />
		</Routes>
	);
}

export default function FlowRoot() {
	return (
		<BrowserRouter>
			<NightSightProvider>
				<FlowRoute />
			</NightSightProvider>
		</BrowserRouter>
	);
}
