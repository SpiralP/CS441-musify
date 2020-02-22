import SpotifyWebApi from "spotify-web-api-node";
import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import Autoplay from "./Autoplay";
import SpotifyPlaylist from "./SpotifyPlaylist";

interface SpotifyProps {
  clientId: string;
  accessToken: string;
}

interface SpotifyState {}

export default class Spotify extends React.PureComponent<
  SpotifyProps,
  SpotifyState
> {
  state: SpotifyState = {};

  api: SpotifyWebApi;

  constructor(props: SpotifyProps) {
    super(props);

    const { clientId, accessToken } = props;

    this.api = new SpotifyWebApi({
      clientId,
      accessToken,
    });
  }

  render() {
    return (
      <Autoplay>
        <SpotifyTrack
          api={this.api}
          trackId="1ugKYT4OfPyp4KFovrk4UL"
          play={true}
        />
        <SpotifyTrack api={this.api} trackId="4Ek5wuxuDrHtf04j3qXQCG" />
        <SpotifyTrack api={this.api} trackId="78Chw7C9NedoNMVKTPDhHU" />
        <SpotifyPlaylist api={this.api} playlistId="0WfvdlPZunjRMlTWpZdK1t" />
      </Autoplay>
    );
  }
}
