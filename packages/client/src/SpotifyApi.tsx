import React from "react";
import { getApi } from "./spotifyAuthentication";
import SpotifyWebApi from "spotify-web-api-node";

export const SpotifyApiContext = React.createContext(new SpotifyWebApi());

interface SpotifyApiProps {
  render: (api: SpotifyWebApi) => React.ReactNode;
}

interface SpotifyApiState {
  currentState:
    | { type: "connecting" }
    | { type: "error"; error: Error }
    | { type: "ready"; api: SpotifyWebApi };
}

export default class SpotifyApi extends React.PureComponent<
  SpotifyApiProps,
  SpotifyApiState
> {
  state: SpotifyApiState = {
    currentState: {
      type: "connecting",
    },
  };

  componentDidMount() {
    getApi()
      .then((api) => {
        this.setState({
          currentState: {
            type: "ready",
            api,
          },
        });
      })
      .catch((error) => {
        this.setState({
          currentState: {
            type: "error",
            error,
          },
        });
      });
  }
  render() {
    const { currentState } = this.state;

    if (currentState.type === "connecting") {
      return "connecting to Spotify";
    } else if (currentState.type === "ready") {
      const { api } = currentState;
      const { render } = this.props;
      return (
        <SpotifyApiContext.Provider value={api}>
          {render(api)}
        </SpotifyApiContext.Provider>
      );
    } else if (currentState.type === "error") {
      return `Error: ${currentState.error}`;
    }
  }
}
