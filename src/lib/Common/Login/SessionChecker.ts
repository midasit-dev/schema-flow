import { fetchFunction } from '../fetch';

export const IsSessionValid = async (token?: string) => {
	if (token === '' || token === null || token === undefined) return false;

	const res = await fetchFunction({
		baseUrl: 'https://members.midasuser.com/auth/api/v1/session-validate',
		token: token,
	});
	if (res.ok) return true;
	else return false;
};

export const GetToken = async (token: any, setToken: any, acc: any, setAcc: any) => {
	let currentToken = token;

	if (await IsSessionValid(currentToken + '')) return currentToken;

	// if token is not valid, try to login
	if (acc === '' || acc === null || acc === undefined) return 'acc is empty';

	if (typeof acc === 'string') acc = JSON.parse(acc);

	const res = await fetchFunction({
		baseUrl: 'https://members.midasuser.com/auth/api/v1/login',
		method: 'POST',
		body: { email: acc.id, password: acc.pwd },
	});

	if (res.ok) {
		const data = await res.json();
		console.log('new Token: ', data.token);
		setToken(data.token);
		return data.token;
	} else {
		setToken('');
		setAcc('');
		return '';
	}
};

export default IsSessionValid;
