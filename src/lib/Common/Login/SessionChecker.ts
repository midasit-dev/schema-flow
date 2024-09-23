export const IsSessionValid = async (token?: string) => {
	if (token === '' || token === null || token === undefined) return false;

	const response = await fetch('https://members.midasuser.com/auth/api/v1/session-validate', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-AUTH-TOKEN': `Bearer ${token}`,
		},
	});

	if (response.ok) return true;
	else return false;
};

export const GetToken = async (token: any, setToken: any, acc: any, setAcc: any) => {
	console.log('token: ', token);
	console.log('acc: ', acc);

	let currentToken = token;

	if (await IsSessionValid(currentToken + '')) return currentToken;

	// if token is not valid, try to login
	if (acc === '' || acc === null || acc === undefined) return 'acc is empty';

	if (typeof acc === 'string') acc = JSON.parse(acc);
	const response = await fetch('https://members.midasuser.com/auth/api/v1/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email: acc.id, password: acc.pwd }),
	});

	if (response.ok) {
		const data = await response.json();
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
