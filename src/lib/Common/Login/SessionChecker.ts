export const IsSessionValid = async (token: string) => {
	if (token === '' || token === null || token === undefined) return 'token is empty';

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

export const GetToken = async (acc: any) => {
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
		console.log('%cnew Token: %c' + data.token, 'color: black; font-weight: bold; padding: 2px;', 'color: red; font-weight: bold;');
		return data.token;
	} else {
		return 'token issuance failed';
	}
};

export default IsSessionValid;
