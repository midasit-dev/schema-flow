import { fetchProps } from './types';

export async function fetchFunction(props: fetchProps) {
	const { baseUrl, tokenHeaderKey = 'X-AUTH-TOKEN', token, method = 'GET', body } = props;

	const options = {
		method: method,
		headers: {
			// 'Content-Type': 'application/json',
		},
	};

	if (token !== undefined) Object.assign(options, { headers: { [tokenHeaderKey]: `Bearer ${token}` } });
	if (method !== 'GET') Object.assign(options, { body: JSON.stringify(body) });

	const res = await fetch(baseUrl, options);
	return res;
}
