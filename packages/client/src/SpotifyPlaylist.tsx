import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import { SpotifyApiContext } from "./SpotifyApi";

interface SpotifyPlaylistProps {
  playlistId: string;
  play?: boolean;
}

interface SpotifyPlaylistState {
  data?: {
    playlist: SpotifyApi.SinglePlaylistResponse;
    tracks: SpotifyApi.PlaylistTrackObject[];
  };
}

export default class SpotifyPlaylist extends React.PureComponent<
  SpotifyPlaylistProps,
  SpotifyPlaylistState
> {
  static contextType = SpotifyApiContext;
  context!: React.ContextType<typeof SpotifyApiContext>;

  state: SpotifyPlaylistState = {};
  audioRef: React.RefObject<HTMLAudioElement> = React.createRef();
  autoPlay: boolean;

  constructor(props: SpotifyPlaylistProps) {
    super(props);

    // TODO
    const { play } = props;
    this.autoPlay = play ? true : false;
  }

  componentDidMount() {
    const api = this.context;
    const { playlistId } = this.props;

    api.getPlaylist(playlistId).then(async (response) => {
      const playlist = response.body;
      const tracks = playlist.tracks.items;

      this.setState({ data: { playlist, tracks } });
    });
  }

  componentDidUpdate(
    prevProps: SpotifyPlaylistProps,
    prevState: SpotifyPlaylistState
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
      const { playlist, tracks } = data;
      const { name, external_urls } = playlist;

      return (
        <div>
          <h3>
            Playlist <a href={external_urls.spotify}> {name}</a>
          </h3>
          {tracks.map((track, i) => (
            <SpotifyTrack key={i} trackId={track.track.id} />
          ))}
        </div>
      );
    }
  }
}
