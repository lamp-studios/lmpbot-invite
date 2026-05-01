export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization failed — no code received.');
  }

  // Exchange the code for an access token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    return res.status(500).send('Failed to exchange code for token.');
  }

  // Use the token to get the user's info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const user = await userRes.json();

  // Redirect to panel (Coming soon)
  res.redirect(
    `https://pastebin.com/gBXapwYc`
  );
}
