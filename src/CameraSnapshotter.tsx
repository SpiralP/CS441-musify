/* eslint-disable jsx-a11y/alt-text */

import React from "react";
import Camera from "./Camera";
import { Intent, Button } from "@blueprintjs/core";

interface CameraSnapshotterProps {
  onCapture: (blob: Blob) => void;
  camera: Camera;
}

interface CameraSnapshotterState {
  currentState:
    | { type: "idle" }
    | { type: "snapshotting" }
    | { type: "error"; error: Error };
}

export default class CameraSnapshotter extends React.PureComponent<
  CameraSnapshotterProps,
  CameraSnapshotterState
> {
  state: CameraSnapshotterState = {
    currentState: { type: "idle" },
  };

  componentDidMount() {
    // capture right away
    this.capture();
  }

  private capture() {
    const { camera, onCapture } = this.props;
    const { currentState } = this.state;

    if (currentState.type !== "idle") {
      return;
    }

    this.setState({ currentState: { type: "snapshotting" } });
    camera
      .capture()
      .then((blob) => {
        onCapture(blob);

        this.setState({ currentState: { type: "idle" } });
      })
      .catch((error) => {
        this.setState({
          currentState: {
            type: "error",
            error,
          },
        });
      });
  }

  render() {
    const { currentState } = this.state;
    const { camera } = this.props;

    const src = camera.canvas.toDataURL();

    return (
      <div>
        <Button
          onClick={() => this.capture()}
          intent={Intent.PRIMARY}
          large
          disabled={currentState.type !== "idle"}
        >
          {currentState.type === "idle"
            ? "Snapshotting!"
            : "Press to Snapshot!"}
        </Button>
        <br />

        <img src={src} />
      </div>
    );
  }
}
