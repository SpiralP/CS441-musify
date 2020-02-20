import React, { useCallback } from "react";
import CameraSnapshotter from "./CameraSnapshotter";
import Spotify from "./Spotify";

export default class App extends React.PureComponent<{}, {}> {
  state = { pressed: false };

  render() {
    const { pressed } = this.state;

    if (!pressed) {
      // force the user to click on the page so that autoplaying works!
      return (
        <button onClick={() => this.setState({ pressed: true })}>
          Press to play audio!
        </button>
      );
    } else {
      return (
        <div>
          <Spotify clientId="ebacb6791c014ba7890d3694545e66f9" />
        </div>
      );
    }
  }
}
