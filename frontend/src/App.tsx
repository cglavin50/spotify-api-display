// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { generateCodeChallenge, generateCodeVerifier } from './utils/pkce';
// import dotenv from 'dotenv';

// dotenv.config();

// required vars
const scopes: string[] = [
  "user-read-private",
  "user-read-email",
  "user-top-read", // for top artists/tracks
  "user-follow-read",
  "user-library-read", // read user saved tracks
  "user-read-recently-played", // recently played tracks
];
// const spotify_auth_endpoint = "https://accounts.spotify.com/authorize";
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;


// entrypoint
function App() {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // Save code verifier to localStorage for later
    localStorage.setItem('spotify_code_verifier', verifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scopes.join(" "),
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <h1>Spotify Tracker</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: '12px 24px',
          fontSize: '1.2rem',
          background: '#1DB954',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          cursor: 'pointer',
        }}
      >
        Login with Spotify
      </button>
    </div>
  );
}

export default App
