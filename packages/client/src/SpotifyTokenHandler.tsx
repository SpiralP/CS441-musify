import SpotifyWebApi from "spotify-web-api-node";
import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import cookie from "cookie";
import Spotify from "./Spotify";

const scopes = ["user-read-private", "user-read-email"];
const redirectUri = location.origin + "/callback";

interface SpotifyTokenHandlerProps {
  clientId: string;
}

interface SpotifyTokenHandlerState {
  currentState:
    | { type: "checkingToken" }
    | { type: "requestingToken" }
    | { type: "error"; error: Error }
    | { type: "ready"; accessToken: string };
}

export default class SpotifyTokenHandler extends React.PureComponent<
  SpotifyTokenHandlerProps,
  SpotifyTokenHandlerState
> {
  state: SpotifyTokenHandlerState = {
    currentState: {
      type: "checkingToken",
    },
  };

  api: SpotifyWebApi;

  constructor(props: SpotifyTokenHandlerProps) {
    super(props);

    const { clientId } = props;

    this.api = new SpotifyWebApi({
      redirectUri,
      clientId,
    });
  }

  requestToken() {
    console.log("requesting token");
    this.setState({ currentState: { type: "requestingToken" } });

    window.location.href = this.api.createAuthorizeURL(scopes, "");
  }

  componentDidMount() {
    const { spotifyAccessToken } = cookie.parse(document.cookie);

    if (spotifyAccessToken) {
      console.log("have token, checking");
      this.api.setAccessToken(spotifyAccessToken);

      this.api.getMe().then(
        () => {
          this.setState({
            currentState: { type: "ready", accessToken: spotifyAccessToken },
          });
        },
        (err) => {
          if (err.message === "Invalid access token") {
            // ask for a new token
            this.requestToken();
          } else {
            console.warn(err.message);
          }
        }
      );
    } else {
      // will refresh the page once gotten
      this.requestToken();
    }
  }

  render() {
    const { currentState } = this.state;

    if (currentState.type === "checkingToken") {
      return "checking Spotify token";
    } else if (currentState.type === "requestingToken") {
      return "requesting";
    } else if (currentState.type === "ready") {
      const { clientId } = this.props;
      const { accessToken } = currentState;
      return <Spotify clientId={clientId} accessToken={accessToken} />;
    } else if (currentState.type === "error") {
      return `Error: ${currentState.error}`;
    } else {
      throw "unreachable";
    }
  }
}
