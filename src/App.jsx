import React from 'react';
import Entry from './Entry';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

const App = () => {
	return (
		<React.Fragment>
			<Entry />
		</React.Fragment>
	);
};

const Wrapper = () => {
	return (
		<RecoilRoot>
			<RecoilNexus />
			<App />
		</RecoilRoot>
	);
};

export default Wrapper;
