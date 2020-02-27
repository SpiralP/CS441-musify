import React from "react";
import { SpotifyApiContext } from "./SpotifyApi";
import Loader from "./Loader";
import AudioTransitioner from "./AudioTransitioner";
import Promise from "bluebird";

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
        promise={() => api.getPlaylist(playlistId)}
        renderError={(error) => `SpotifyPlaylist error: ${error}`}
        renderLoading={() => "loading playlist metadata"}
        renderSuccess={({ body }) => (
          <Loader<
            {
              body: SpotifyApi.SinglePlaylistResponse;
              tracks: SpotifyApi.SingleTrackResponse[];
            },
            { loaded: number; total: number }
          >
            promise={async (update) => {
              let loaded = 0;

              const lightTracks = body.tracks.items;
              const tracks = await Promise.map(
                lightTracks,
                async ({ track: { id } }) => {
                  const track = await api.getTrack(id);

                  loaded += 1;
                  update({ loaded, total: lightTracks.length });

                  return track.body;
                },

                { concurrency: 4 }
              );

              return { body, tracks };
            }}
            renderError={(error) => `SpotifyPlaylist track error: ${error}`}
            renderLoading={(value) =>
              `loading playlist ${
                value ? Math.floor((value.loaded / value.total) * 100) : 0
              }%`
            }
            renderSuccess={({ body, tracks }) => {
              const { name, external_urls } = body;
              const urlToTrack: {
                [url: string]: SpotifyApi.SingleTrackResponse;
              } = {};

              const trackUrls = tracks.map((track) => {
                const url = track.preview_url;
                urlToTrack[url] = track;
                return url;
              });

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
