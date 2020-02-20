import SpotifyWebApi from "spotify-web-api-node";
import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import cookie from "cookie";

const scopes = ["user-read-private", "user-read-email"];
const redirectUri = location.origin + "/callback";

interface SpotifyProps {
  clientId: string;
}

interface SpotifyState {
  currentState:
    | { type: "checkingToken" }
    | { type: "requestingToken" }
    | { type: "error"; error: Error }
    | { type: "ready" };
}

export default class Spotify extends React.PureComponent<
  SpotifyProps,
  SpotifyState
> {
  state: SpotifyState = {
    currentState: {
      type: "checkingToken",
    },
  };

  api: SpotifyWebApi;

  constructor(props: SpotifyProps) {
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
          this.setState({ currentState: { type: "ready" } });
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

    if (currentState.type === "requestingToken") {
      return "requesting";
    } else if (currentState.type === "ready") {
      return (
        <>
          <SpotifyTrack api={this.api} trackId="1ugKYT4OfPyp4KFovrk4UL" />
          <SpotifyTrack
            api={this.api}
            trackId="4Ek5wuxuDrHtf04j3qXQCG"
            play={true}
          />
          <SpotifyTrack api={this.api} trackId="78Chw7C9NedoNMVKTPDhHU" />
        </>
      );
    } else if (currentState.type === "error") {
      return `Error: ${currentState.error}`;
    } else if (currentState.type === "checkingToken") {
      return "checking Spotify token";
    } else {
      throw "unreachable";
    }
  }
}
