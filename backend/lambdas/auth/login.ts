import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read", // for top artists/tracks
  "user-follow-read",
  "user-library-read", // read user saved tracks
  "user-read-recently-played", // recently played tracks
];

export const handleLogin = async (
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  const state = generateRandomString(16); // For CSRF protection, optional but recommended

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
    state,
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://accounts.spotify.com/authorize?${queryParams.toString()}`,
      'Set-Cookie': `spotify_auth_state=${state}; HttpOnly; Secure; Path=/; Max-Age=300`,
    },
    body: '',
  };
};

// Generates a random alphanumeric string (used for state)
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}
