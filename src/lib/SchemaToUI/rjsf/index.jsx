import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const log = (type) => console.log.bind(console, type);

export default function RJSFComp(props) {
	const { schema, path } = props;

	console.log('schema', schema);

	async function postFunctionExecute(body) {
		// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
		const res = fetch(
			`${process.env.REACT_APP_API_URL}backend/function-executor/python-execute${path}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	}

	function onSubmit(data) {
		console.log('submitted', data.formData);
		postFunctionExecute(data.formData);
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
