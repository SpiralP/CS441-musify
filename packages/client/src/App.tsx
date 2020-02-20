import React from "react";
import CameraSnapshotter from "./CameraSnapshotter";
import SpotifyTokenHandler from "./SpotifyTokenHandler";

export default class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div>
        <SpotifyTokenHandler clientId="ebacb6791c014ba7890d3694545e66f9" />
      </div>
    );
  }
}
