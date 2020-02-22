import qs from "qs";
import SpotifyWebApi from "spotify-web-api-node";

const CLIENT_ID = "ebacb6791c014ba7890d3694545e66f9";
const CLIENT_SECRET = "50fd18b26f5246298e3939767e3f4008";

const LOCAL_STORAGE_KEY = "spotify";

const SCOPES = ["user-read-private", "user-read-email"];
const REDIRECT_URI = window.location.origin + "/";

const api = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

/**
 * Response returned when requesting for access token
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#2-have-your-application-request-refresh-and-access-tokens-spotify-returns-access-and-refresh-tokens
 */
interface AuthorizationCodeGrantResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface StorageItem extends AuthorizationCodeGrantResponse {
  // Date.getTime()
  expires: number;
}

interface QueryParams {
  error?: string;
  code?: string;
}

const localStorage = window.localStorage;

function getStorage() {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item) {
    const obj: StorageItem = JSON.parse(item);
    return obj;
  }
}

function setStorage(item: StorageItem) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(item));
}

/**
 * Redirect to Spotify's authenticate page, and redirect back to our index.js site.
 * Cache our access_token in localStorage
 */
export async function getApi(): Promise<SpotifyWebApi> {
  // check if we have query param "code" from spotify's callback

  const query: QueryParams = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  if (query.code) {
    const data = await api
      .authorizationCodeGrant(query.code)
      .then((data) => data.body)
      .catch(async (err) => {
        if (err.message === "invalid_grant: Invalid authorization code") {
          // "code" expired
          await getNewToken();
          throw new Error("unreachable");
        } else {
          throw err;
        }
      });

    const { expires_in, access_token, refresh_token } = data;

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expires_in);

    setStorage({ ...data, expires: expires.getTime() });

    window.history.pushState(null, "", "/");

    api.setAccessToken(access_token);
    api.setRefreshToken(refresh_token);

    return api;
  } else if (query.error) {
    throw new Error(`Spotify callback returned error: ${query.error}`);
  }

  const item = getStorage();
  if (item) {
    const { expires, access_token, refresh_token } = item;

    if (Date.now() < expires) {
      // not expired yet!

      api.setAccessToken(access_token);
      api.setRefreshToken(refresh_token);

      await api.getMe().catch(async (err) => {
        if (err.message === "Invalid access token") {
          // access token expired
          await getNewToken();
        } else {
          throw err;
        }
      });

      return api;
    }
  }

  // expired or not in storage
  await getNewToken();
  throw new Error("unreachable");
}

async function getNewToken() {
  window.location.href = api.createAuthorizeURL(SCOPES, "");

  await new Promise(() => {});
  throw new Error("unreachable");
}
