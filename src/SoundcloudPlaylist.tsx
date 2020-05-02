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
  genre: string;

  /**
   * defaults to true
   */
  autoPlay: boolean;
}

export default class SoundcloudPlaylist extends React.PureComponent<
  SoundcloudPlaylistProps,
  {}
> {
  static defaultProps = {
    autoPlay: true,
  };

  render() {
    const { genre: genre } = this.props;

    return (
      <Loader
        promise={() =>
          SC.get("/tracks", {
            genres: genre,
            bpm: { from: 120 },
          })
        }
        renderError={(error) => `Error: ${error}`}
        renderLoading={() => "Loading Tracks"}
        renderSuccess={(tracks) => {
          const { autoPlay } = this.props;

          const track = tracks[Math.floor(Math.random() * tracks.length)];

          return (
            <SoundcloudEmbed autoPlay={autoPlay} url={track.permalink_url} />
          );
        }}
      />
    );
  }
}

interface SoundcloudEmbedProps {
  url: string;
  autoPlay: boolean;
}

class SoundcloudEmbed extends React.PureComponent<SoundcloudEmbedProps, {}> {
  divRef: React.RefObject<HTMLDivElement> = React.createRef();
  oEmbed?: any;

  componentDidMount() {
    const { url, autoPlay } = this.props;

    const element = this.divRef.current;
    if (!element) {
      throw new Error("no element?");
    }

    SC.oEmbed(url, {
      auto_play: autoPlay,
      element,
    })
      .then((oEmbed: any) => {
        this.oEmbed = oEmbed;
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  render() {
    return <div ref={this.divRef}></div>;
  }
}
