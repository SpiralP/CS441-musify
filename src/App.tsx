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
  clicked: boolean;
}

export default class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    clicked: false,
  };

  render() {
    const { clicked } = this.state;

    return (
      <div>
        <h1
          className="titlename"
          onClick={() => {
            this.setState({
              clicked: true,
            });
          }}
        >
          {clicked ? "CLICKED" : "not yet clicked"}
        </h1>
      </div>
    );
  }
}
