import React from "react";
import { getApi } from "./spotifyAuthentication";
import SpotifyWebApi from "spotify-web-api-node";
import Loader from "./Loader";

export const SpotifyApiContext = React.createContext(new SpotifyWebApi());

interface SpotifyApiProps {
  render: (api: SpotifyWebApi) => React.ReactNode;
}

export default function SpotifyApi({ render }: SpotifyApiProps) {
  return (
    <Loader
      promise={() => getApi()}
      renderError={(error) => `Spotify api error: ${error}`}
      renderLoading={"Connecting to Spotify"}
      renderSuccess={(api) => (
        <SpotifyApiContext.Provider value={api}>
          {render(api)}
        </SpotifyApiContext.Provider>
      )}
    />
  );
}
