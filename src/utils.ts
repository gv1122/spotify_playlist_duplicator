import crypto from 'crypto';

export function generateRandomString(length) {
	let text = '';
	const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export async function generateCodeChallenge(codeVerifier) {
	function base64encode(string) {
		return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);

	return base64encode(digest);
}
