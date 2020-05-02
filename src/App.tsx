/* eslint-disable jsx-a11y/alt-text */

import React from "react";
import { getFacesFromData, FaceApiResponse } from "./face";
import Autoplay from "./Autoplay";
import CameraSnapshotter from "./CameraSnapshotter";
import Camera from "./Camera";
import Loader from "./Loader";
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
        <img src="logo.png" />
        <br />

        <Autoplay>
          <Loader
            promise={() => Camera.setup()}
            renderError={(error) => `Camera error: ${error}`}
            renderLoading={() => "loading camera"}
            renderSuccess={(camera) => (
              <CameraSnapshotter
                camera={camera}
                onCapture={(blob) => {
                  this.setState({
                    currentState: {
                      type: "askingServer",
                    },
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
        </Autoplay>
      </div>
    );
  }
}
