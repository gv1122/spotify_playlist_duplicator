import express, { Request, Response } from 'express';
import axios from 'axios';

import { generateRandomString, generateCodeChallenge } from './utils';

const app = express();

const clientId = '2d73afa9466c4587b813485770e6402d';
const redirectUri = 'http://localhost:8888/callback';
const codeVerifier = generateRandomString(128);
let challenge = '';

app.get('/login', async (_: Request, res: Response) => {
	const scopes = 'user-read-private user-read-email';
	challenge = await generateCodeChallenge(codeVerifier);

	res.redirect(
		`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
			scopes
		)}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}&code_challenge_method=S256&code_challenge=${challenge}`
	);
});

app.get('/callback', async (req: Request, res: Response) => {
	const code = req.query.code as string;

	try {
		const tokenResponse = await axios.post(
			'https://accounts.spotify.com/api/token',
			{
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				client_id: clientId,
				code_verifier: codeVerifier,
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		const accessToken = tokenResponse.data.access_token;
		const refreshToken = tokenResponse.data.refresh_token;
		
		console.log(accessToken);
		console.log(refreshToken);

		res.redirect('/success');
	} catch (error) {
		console.error('Error exchanging authorization code:', error);
		res.status(500).send('Error during authentication');
	}
});

app.get('/success', (_: Request, res: Response) => {
	res.status(200).send('You can return to the application!');
});

app.listen(8888, () => {
	console.log('Server running on port 8888');
});
