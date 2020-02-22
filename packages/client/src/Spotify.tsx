import SpotifyWebApi from "spotify-web-api-node";
import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import Autoplay from "./Autoplay";
import SpotifyPlaylist from "./SpotifyPlaylist";

interface SpotifyProps {
  api: SpotifyWebApi;
}

export default class Spotify extends React.PureComponent<SpotifyProps, {}> {
  render() {
    const { api } = this.props;

    return (
      <Autoplay>
        <SpotifyTrack api={api} trackId="1ugKYT4OfPyp4KFovrk4UL" play={true} />
        <SpotifyTrack api={api} trackId="4Ek5wuxuDrHtf04j3qXQCG" />
        <SpotifyTrack api={api} trackId="78Chw7C9NedoNMVKTPDhHU" />
        <SpotifyPlaylist api={api} playlistId="0WfvdlPZunjRMlTWpZdK1t" />
      </Autoplay>
    );
  }
}
