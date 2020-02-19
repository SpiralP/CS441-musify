import SpotifyWebApi from "spotify-web-api-node";
import React from "react";
import PromiseComponent from "./SpotifyTrack";
import SpotifyTrack from "./SpotifyTrack";

const scopes = ["user-read-private", "user-read-email"];
const redirectUri = location.origin + "/callback";

interface SpotifyProps {
  clientId: string;
}

interface SpotifyState {
  currentState:
    | { type: "unknown" }
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
      type: "unknown",
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
    // Create the authorization URL
    const authorizeURL = this.api.createAuthorizeURL(scopes, "");

    // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
    window.location.href = authorizeURL;
  }

  componentDidMount() {
    // TODO maybe as a header
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");

    if (accessToken) {
      console.log("have token");
      this.api.setAccessToken(accessToken);

      this.setState({ currentState: { type: "ready" } });
    } else {
      console.log("requesting token");
      this.setState({ currentState: { type: "requestingToken" } });

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
          <SpotifyTrack api={this.api} trackId="4QqZcaQTAd25brQV91eegi" />
        </>
      );
    } else if (currentState.type === "error") {
      return `Error: ${currentState.error}`;
    } else {
      return "loading";
    }
  }
}
