import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';

import Home from './lib/Pages/Home';
import SchemaFlow from './lib/Pages/SchemaFlow';
import Intro from './lib/Pages/Intro';

function FlowRoute() {
	const location = useLocation();

	return (
		<Routes location={location}>
			<Route path='/*' element={<SchemaFlow />} />
			<Route path='/home' element={<Home />} />
			<Route path='/intro' element={<Intro />} />
		</Routes>
	);
}

export default function FlowRoot() {
	return (
		<BrowserRouter>
			<FlowRoute />
		</BrowserRouter>
	);
}
