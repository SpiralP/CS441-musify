import React from "react";
import Loader from "./Loader";
import AudioTransitioner from "./AudioTransitioner";
import Promise from "bluebird";
import SC from "soundcloud";

// https://github.com/soundcloud/soundcloud-javascript/blob/47a6a781273da1b7ce205ca429098f0b9456fe2d/src/api.js#L113
SC.initialize({
  client_id: "4d36f18cedb9389168729243da7685f7",
});

interface SoundcloudPlaylistProps {
  playlistId: string;

  /**
   * defaults to true
   */
  auto_play: boolean;
}

export default class SoundcloudPlaylist extends React.PureComponent<
  SoundcloudPlaylistProps,
  {}
> {
  static defaultProps = {
    autoPlay: true,
  };

  divRef: React.RefObject<HTMLDivElement> = React.createRef();
  oEmbed?: any;

  componentDidMount() {
    const { playlistId, auto_play } = this.props;
    const element = this.divRef.current;
    if (!element) {
      throw new Error("no element?");
    }

    // @ts-ignore
    SC.get("/tracks", {
      genres: "hardbass",
      bpm: { from: 120 },
    }).then((tracks: any) => {
      console.log(tracks);

      SC.oEmbed(tracks[0].permalink_url, {
        auto_play,
        element,
      })
        .then((oEmbed: any) => {
          this.oEmbed = oEmbed;
        })
        .catch((err) => {
          console.warn(err);
        });
    });
  }

  render() {
    return <div ref={this.divRef}></div>;
  }
}
