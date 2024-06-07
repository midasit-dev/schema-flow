import React from 'react';
import SchemaUIBuilder from './lib';
import { RecoilRoot } from 'recoil';

const App = () => {
	return (
		<React.Fragment>
			<SchemaUIBuilder />
		</React.Fragment>
	);
};

const Wrapper = () => {
	return (
		<RecoilRoot>
			<App />
		</RecoilRoot>
	);
};

export default Wrapper;
