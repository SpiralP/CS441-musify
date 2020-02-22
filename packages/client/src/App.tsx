import React from "react";
import SpotifyApi from "./SpotifyApi";
import { getFacesFromData, FaceApiResponse } from "./face";
import Mooder from "./Mooder";
import Autoplay from "./Autoplay";
import SpotifyTrack from "./SpotifyTrack";
import SpotifyPlaylist from "./SpotifyPlaylist";
import CameraSnapshotter from "./CameraSnapshotter";
import Camera from "./Camera";
import Loader from "./Loader";

// type Mood =
//   | "anger"
//   | "contempt"
//   | "disgust"
//   | "fear"
//   | "happiness"
//   | "neutral"
//   | "sadness"
//   | "surprise";

interface AppState {
  currentState:
    | { type: "idle" }
    | { type: "askingServer" }
    | { type: "data"; data: FaceApiResponse };
}

export default class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    currentState: { type: "idle" },
  };

  render() {
    const { currentState } = this.state;

    return (
      <div>
        <Loader
          promise={() => Camera.setup()}
          renderError={(error) => `Camera error: ${error}`}
          renderLoading={"loading camera"}
          renderSuccess={(camera) => (
            <CameraSnapshotter
              camera={camera}
              interval={4000}
              onCapture={(blob) => {
                this.setState({
                  currentState: { type: "askingServer" },
                });

                getFacesFromData(blob).then((data) => {
                  console.log(data);

                  this.setState({
                    currentState: { type: "data", data },
                  });
                });
              }}
            />
          )}
        />

        {currentState.type === "data" ? (
          <Mooder data={currentState.data} />
        ) : null}

        <SpotifyApi
          render={() => (
            <Autoplay>
              <SpotifyTrack trackId="1ugKYT4OfPyp4KFovrk4UL" play={true} />
              <SpotifyTrack trackId="4Ek5wuxuDrHtf04j3qXQCG" />
              <SpotifyTrack trackId="78Chw7C9NedoNMVKTPDhHU" />
              <SpotifyPlaylist playlistId="0WfvdlPZunjRMlTWpZdK1t" />
            </Autoplay>
          )}
        />
      </div>
    );
  }
}
