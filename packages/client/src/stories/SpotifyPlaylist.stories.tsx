import React from "react";
import SpotifyPlaylist from "../SpotifyPlaylist";
import SpotifyApi from "../SpotifyApi";

export default {
  title: "SpotifyPlaylist",
  component: SpotifyPlaylist,
};

export const Basic = () => (
  <SpotifyApi
    render={() => <SpotifyPlaylist playlistId="0WfvdlPZunjRMlTWpZdK1t" />}
  />
);
