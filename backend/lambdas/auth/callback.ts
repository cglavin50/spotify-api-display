import { APIGatewayProxyEventV2, APIGatewayProxyHandler } from "aws-lambda";
import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

export const handleCallback= async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  try {
    const queryParams = event.queryStringParameters || {};
    const code = queryParams.code;

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing code parameter" }),
      };
    }

    // Prepare the token request
    const tokenUrl = "https://accounts.spotify.com/api/token";

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }).toString();

    // Spotify requires client credentials in Basic Auth header
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Exchange code for tokens
    const response = await axios.post(tokenUrl, body, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // TODO: Store tokens securely or create session for SPA

    // For testing, just return tokens in response (not recommended in prod)
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token,
        refresh_token,
        expires_in,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error: any) {
    console.error("Error exchanging code:", error.response?.data || error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to exchange code" }),
    };
  }
};
