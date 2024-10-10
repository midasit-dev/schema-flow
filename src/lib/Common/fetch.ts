import { fetchProps } from './types';
import { IsSessionValid, GetToken } from './Login/SessionChecker';
import rss from 'react-secure-storage';

export async function fetchFunction(props: fetchProps) {
	const { baseUrl, tokenHeaderKey = 'X-AUTH-TOKEN', token, method = 'GET', body } = props;

	const options: RequestInit = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// 토큰 설정
	if (token !== undefined && token !== '' && token !== null) {
		let newToken = '';
		const acc = rss.getItem('acc') as string;
		const isValid = await IsSessionValid(token);
		if (!isValid) {
			console.log('token is invalid');
			const newTokenResult = await GetToken(acc);
			if (newTokenResult === 'acc is empty' || newTokenResult === 'token issuance failed') {
				console.error(newTokenResult);
				return null;
			} else {
				newToken = newTokenResult;
			}
		} else {
			newToken = token;
		}

		Object.assign(options.headers || {}, { [`${tokenHeaderKey}`]: `Bearer ${newToken}` });
	}

	// GET 이외의 요청일 때, body가 FormData면 그대로, 그 외는 JSON.stringify로 변환
	if (method !== 'GET') {
		if (body instanceof FormData) {
			// FormData일 경우 Content-Type을 자동으로 설정하므로 명시적으로 제거
			if (options.headers && 'Content-Type' in options.headers) {
				delete (options.headers as Record<string, string>)['Content-Type'];
			}
			Object.assign(options, { body: body });
		} else {
			Object.assign(options, { body: typeof body === 'string' ? body : JSON.stringify(body) });
		}
	}
	const res = await fetch(baseUrl, options);
	return res;
}
