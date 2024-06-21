import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

async function postFunctionExecute(path, body, setResponseData) {
	// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
	const res = await fetch(
		`${process.env.REACT_APP_API_URL}backend/function-executor/python-execute${path}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	if (res.ok) {
		const data = await res.json();
		console.log('data', data);
		setResponseData(data);
	}
}

export default function RJSFComp(props) {
	const { schema, path, enqueueSnackbar, setResponseData, setIsloading } = props;

	async function onSubmit(data) {
		setIsloading(true);
		await postFunctionExecute(path, data.formData, setResponseData);
		setIsloading(false);
	}

	return (
		<Form
			schema={schema}
			validator={validator}
			onChange={() => {}}
			onSubmit={onSubmit}
			onError={() => {}}
		>
			<button
				type='submit'
				className='btn btn-primary'
				style={{
					width: '100%',
					position: 'fixed',
					bottom: 0,
					left: 0,
					backgroundColor: 'rgba(255,255,255,0.7)',
					height: '30px',
					padding: 0,
					margin: 0,
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
					border: '1px solid #c1c1c3',
					color: 'black',
				}}
			>
				Run
			</button>
		</Form>
	);
}
