import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

interface SpotifyTrackProps {
  api: SpotifyWebApi;
  trackId: string;
}

interface SpotifyTrackState {
  data?: SpotifyApi.SingleTrackResponse;
}

export default class SpotifyTrack extends React.PureComponent<
  SpotifyTrackProps,
  SpotifyTrackState
> {
  state: SpotifyTrackState = {};

  componentDidMount() {
    const { api, trackId } = this.props;

    api.getTrack(trackId).then((response) => {
      this.setState({ data: response.body });
    });
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return "loading";
    } else {
      const { name, artists, preview_url } = data;

      if (!preview_url) {
        // TODO maybe premium people can play directly?
        // maybe with Player ?
        throw new Error("not preview_url");
      }

      return (
        <div>
          <h3>
            {name} by {artists.map((artist) => artist.name).join(", ")}
          </h3>
          <audio src={preview_url} autoPlay={true} controls={true} />
        </div>
      );
    }
  }
}
