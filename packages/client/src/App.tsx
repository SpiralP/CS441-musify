import React from "react";
import SpotifyApi from "./SpotifyApi";
import { getFacesFromData, FaceApiResponse } from "./face";
import Mooder from "./Mooder";
import Autoplay from "./Autoplay";
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
        <h1 className="titlename">jflkajfaksljfl</h1>
      </div>
    );
  }
}
