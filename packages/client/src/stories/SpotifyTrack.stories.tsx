import React from "react";
import SpotifyTrack from "../SpotifyTrack";
import SpotifyApi from "../SpotifyApi";

export default {
  title: "SpotifyTrack",
  component: SpotifyTrack,
};

export const Basic = () => (
  <SpotifyApi
    render={() => <SpotifyTrack trackId="1ugKYT4OfPyp4KFovrk4UL" play={true} />}
  />
);
