import { fastObjectShallowCompare } from "@mui/x-data-grid/utils/fastObjectShallowCompare";
import rss from "react-secure-storage";

export const IsSessionValid = async (token?: string) => {
	if (token === "" || token === null || token === undefined) return false;

	const response = await fetch("https://members.midasuser.com/auth/api/v1/session-validate", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"X-AUTH-TOKEN": `Bearer ${token}`,
		},
	});

	console.log(response);

	if (response.ok) return true;
	else return false;
};

export const GetToken = async () => {
	let currentToken = rss.getItem("token");

	if (await IsSessionValid(currentToken + "")) return currentToken;

	const acc = rss.getItem("acc");
	if (acc === "" || acc === null || acc === undefined) return "";
	let accObj;
	try {
		accObj = JSON.parse(acc as string);
	} catch {
		return "";
	}

	const response = await fetch("https://members.midasuser.com/auth/api/v1/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: accObj.id, password: accObj.pwd })
	});

	if (response.ok) {
		const data = await response.json();
		rss.setItem("token", data.token);
		return data.token;
	} else {
		rss.removeItem("token");
		rss.removeItem("acc");
		return "";
	}
};

export default IsSessionValid;