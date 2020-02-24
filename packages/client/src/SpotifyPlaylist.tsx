import React from "react";
import { SpotifyApiContext } from "./SpotifyApi";
import Loader from "./Loader";
import AudioTransitioner from "./AudioTransitioner";

interface SpotifyPlaylistProps {
  playlistId: string;

  /**
   * defaults to false
   */
  autoPlay: boolean;
}

export default class SpotifyPlaylist extends React.PureComponent<
  SpotifyPlaylistProps,
  {}
> {
  static defaultProps = {
    autoPlay: false,
  };
  static contextType = SpotifyApiContext;
  context!: React.ContextType<typeof SpotifyApiContext>;

  render() {
    const { playlistId, autoPlay } = this.props;
    const api = this.context;

    return (
      <Loader
        promise={() =>
          api.getPlaylist(playlistId).then(({ body }) => {
            const tracks = body.tracks.items;
            const trackIds = tracks.map((track) => track.track.id);
            return { body, trackIds };
          })
        }
        renderError={(error) => `SpotifyPlaylist error: ${error}`}
        renderLoading={() => "loading playlist"}
        renderSuccess={({ body, trackIds }) => (
          <Loader
            promise={async (update) => {
              const tracks: SpotifyApi.SingleTrackResponse[] = [];
              for (let index = 0; index < trackIds.length; index++) {
                const id = trackIds[index];

                update(index / trackIds.length);
                const track = await api.getTrack(id);
                tracks.push(track.body);
              }

              return { body, tracks };
            }}
            renderError={(error) => `SpotifyPlaylist track error: ${error}`}
            renderLoading={(updateValue: number | null) =>
              `loading playlist ${
                updateValue ? Math.floor(updateValue * 100) : 0
              }%`
            }
            renderSuccess={({ body, tracks }) => {
              const { name, external_urls } = body;
              const urlToTrack: {
                [url: string]: SpotifyApi.SingleTrackResponse;
              } = {};

              const trackUrls = tracks.map(
                (track: SpotifyApi.SingleTrackResponse) => {
                  const url = track.preview_url;
                  urlToTrack[url] = track;
                  return url;
                }
              );

              return (
                <div>
                  <h3>
                    Playlist <a href={external_urls.spotify}> {name}</a>
                  </h3>
                  <AudioTransitioner
                    urls={trackUrls}
                    autoPlay={autoPlay}
                    render={(url) => {
                      if (!url) {
                        return null;
                      }

                      const { external_urls, name, artists } = urlToTrack[url];
                      return (
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
                      );
                    }}
                  />
                </div>
              );
            }}
          />
        )}
      />
    );
  }
}
