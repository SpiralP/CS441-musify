import React from "react";
import { SpotifyApiContext } from "./SpotifyApi";
import Loader from "./Loader";

interface SpotifyTrackProps {
  trackId: string;
  play?: boolean;
}

export default class SpotifyTrack extends React.PureComponent<
  SpotifyTrackProps,
  {}
> {
  static contextType = SpotifyApiContext;
  context!: React.ContextType<typeof SpotifyApiContext>;

  audioRef: React.RefObject<HTMLAudioElement> = React.createRef();
  autoPlay: boolean;

  constructor(props: SpotifyTrackProps) {
    super(props);

    const { play } = props;

    this.autoPlay = play ? true : false;
  }

  componentDidUpdate(prevProps: SpotifyTrackProps) {
    const { play } = this.props;
    if (play !== prevProps.play) {
      const audio = this.audioRef.current;
      if (audio) {
        if (play) {
          audio.play();
        } else {
          audio.pause();
        }
      } else {
        console.warn("play modified but no audio element!");
      }
    }
  }

  render() {
    const api = this.context;
    const { trackId } = this.props;

    return (
      <Loader
        promise={() => api.getTrack(trackId)}
        renderError={(error) => `SpotifyTrack error: ${error}`}
        renderLoading={"loading track"}
        renderSuccess={({ body }) => {
          const { name, external_urls, artists, preview_url } = body;

          if (!preview_url) {
            // TODO maybe premium people can play directly?
            // maybe with Player ?
            throw new Error("not preview_url");
          }

          return (
            <div>
              <h3>
                <a href={external_urls.spotify}> {name}</a>
                {" by "}
                {artists.map(({ name, external_urls }, i) => [
                  i > 0 && ", ",
                  <a key={i} href={external_urls.spotify}>
                    {name}
                  </a>,
                ])}
              </h3>
              <audio
                ref={this.audioRef}
                src={preview_url}
                preload="none"
                autoPlay={this.autoPlay}
                controls={true}
              />
            </div>
          );
        }}
      />
    );
  }
}
