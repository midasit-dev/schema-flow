import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const log = (type) => console.log.bind(console, type);

export default function RJSFRender(props) {
	const { schema } = props;

	return (
		<Form
			schema={schema}
			validator={validator}
			onChange={log('changed')}
			onSubmit={log('submitted')}
			onError={log('errors')}
		/>
	);
}
