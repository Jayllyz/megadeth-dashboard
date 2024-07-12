import { SpotifyAPI } from '@statsfm/spotify.js';

export const api = new SpotifyAPI({
  clientCredentials: {
    clientId: process.env.CLIENT_ID as string,
    clientSecret: process.env.SECRET_ID as string,
  },
});
