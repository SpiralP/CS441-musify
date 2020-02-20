import React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyTrack from "./SpotifyTrack";

interface SpotifyPlaylistProps {
  api: SpotifyWebApi;
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
    const { api, playlistId } = this.props;

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
    const { api } = this.props;
    const { data } = this.state;
    if (!data) {
      return "loading";
    } else {
      const { autoPlay } = this;
      const { playlist, tracks } = data;
      const { name, external_urls } = playlist;

      return (
        <div>
          <h3>
            Playlist <a href={external_urls.spotify}> {name}</a>
          </h3>
          {tracks.map((track) => (
            <SpotifyTrack api={api} trackId={track.track.id} />
          ))}
        </div>
      );
    }
  }
}
