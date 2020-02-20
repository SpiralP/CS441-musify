import React from "react";
import Camera from "./Camera";

interface CameraSnapshotterProps {
  onCapture: (blob: Blob) => void;
  camera: Camera;

  /**
   * in seconds
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

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

  setError(error: Error) {
    this.setState({ currentState: { type: "error", error } });
  }

  componentDidMount() {
    const { interval } = this.props;

    setTimeout(() => this.capture(), interval * 1000);
  }

  capture() {
    const { interval, camera, onCapture } = this.props;

    this.setState({ currentState: { type: "snapshotting" } });
    camera.capture().then((blob) => {
      onCapture(blob);

      this.setState({ currentState: { type: "idle" } });
    });

    setTimeout(() => this.capture(), interval * 1000);
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
