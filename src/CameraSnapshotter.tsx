import React from "react";
import Camera from "./Camera";

interface CameraSnapshotterProps {
  onCapture: (blob: Blob) => void;
  camera: Camera;

  /**
   * milliseconds
   */
  interval: number;
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
    const { interval, camera, onCapture } = this.props;
    const { currentState } = this.state;

    if (currentState.type !== "idle") {
      throw new Error("wasn't idle");
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

    setTimeout(() => this.capture(), interval);
  }

  render() {
    const { currentState } = this.state;

    if (currentState.type === "idle") {
      return "idle";
    } else if (currentState.type === "snapshotting") {
      return "snapshotting!";
    } else if (currentState.type === "error") {
      return `${currentState.error}`;
    }
  }
}
