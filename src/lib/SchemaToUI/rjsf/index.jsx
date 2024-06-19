import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const log = (type) => console.log.bind(console, type);

export default function RJSFRender(props) {
	const { schema } = props;
	console.log('schema', schema);

	// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
	function onSubmit(data) {
		console.log('submitted', data.formData);
	}

	return (
		<Form
			schema={schema}
			validator={validator}
			onChange={log('changed')}
			onSubmit={onSubmit}
			onError={log('errors')}
		>
			<button type='submit' className='btn btn-primary' style={{ width: '100%' }}>
				Submit
			</button>
		</Form>
	);
}
