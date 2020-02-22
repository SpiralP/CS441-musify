import React from "react";
import SpotifyApi from "./SpotifyApi";
import CameraSetup from "./CameraSetup";
import { getFacesFromData, FaceApiResponse } from "./face";
import Mooder from "./Mooder";

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
        <CameraSetup
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

        {currentState.type === "data" ? (
          <Mooder data={currentState.data} />
        ) : null}

        <SpotifyApi />
      </div>
    );
  }
}
