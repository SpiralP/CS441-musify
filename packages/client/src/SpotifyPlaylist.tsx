import React from "react";
import SpotifyTrack from "./SpotifyTrack";
import { SpotifyApiContext } from "./SpotifyApi";
import Loader from "./Loader";

interface SpotifyPlaylistProps {
  playlistId: string;

  // TODO
  // play?: boolean;
}

export default class SpotifyPlaylist extends React.PureComponent<
  SpotifyPlaylistProps,
  {}
> {
  static contextType = SpotifyApiContext;
  context!: React.ContextType<typeof SpotifyApiContext>;

  audioRef: React.RefObject<HTMLAudioElement> = React.createRef();
  // autoPlay: boolean;

  // constructor(props: SpotifyPlaylistProps) {
  //   super(props);

  // TODO
  // const { play } = props;
  // this.autoPlay = play ? true : false;
  // }

  componentDidMount() {
    const api = this.context;
    const { playlistId } = this.props;

    api.getPlaylist(playlistId).then(async (response) => {
      const playlist = response.body;
      const tracks = playlist.tracks.items;

      this.setState({ data: { playlist, tracks } });
    });
  }

  render() {
    const api = this.context;
    const { playlistId } = this.props;

    return (
      <Loader
        promise={api.getPlaylist(playlistId)}
        renderError={(error) => `SpotifyPlaylist error: ${error}`}
        renderLoading={"loading playlist"}
        renderSuccess={({ body }) => {
          const tracks = body.tracks.items;
          const { name, external_urls } = body;

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
        }}
      />
    );
  }
}
