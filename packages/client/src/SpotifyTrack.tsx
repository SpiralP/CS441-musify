import React from "react";
import { SpotifyApiContext } from "./SpotifyApi";

interface SpotifyTrackProps {
  trackId: string;
  play?: boolean;
}

interface SpotifyTrackState {
  data?: SpotifyApi.SingleTrackResponse;
}

export default class SpotifyTrack extends React.PureComponent<
  SpotifyTrackProps,
  SpotifyTrackState
> {
  static contextType = SpotifyApiContext;
  context!: React.ContextType<typeof SpotifyApiContext>;

  state: SpotifyTrackState = {};
  audioRef: React.RefObject<HTMLAudioElement> = React.createRef();
  autoPlay: boolean;

  constructor(props: SpotifyTrackProps) {
    super(props);

    const { play } = props;

    this.autoPlay = play ? true : false;
  }

  componentDidMount() {
    const api = this.context;
    const { trackId } = this.props;

    api.getTrack(trackId).then((response) => {
      this.setState({ data: response.body });
    });
  }

  componentDidUpdate(
    prevProps: SpotifyTrackProps,
    prevState: SpotifyTrackState
  ) {
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
    const { data } = this.state;
    if (!data) {
      return "loading";
    } else {
      const { autoPlay } = this;
      const { name, external_urls, artists, preview_url } = data;

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
            autoPlay={autoPlay}
            controls={true}
          />
        </div>
      );
    }
  }
}
