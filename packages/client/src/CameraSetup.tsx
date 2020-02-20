import React from "react";
import CameraSnapshotter from "./CameraSnapshotter";
import Camera from "./Camera";

interface CameraSetupProps {
  onCapture: (blob: Blob) => void;
}

interface CameraSetupState {
  currentState:
    | { type: "requestingPermission" }
    | { type: "error"; error: Error }
    | { type: "ready"; camera: Camera };
}

export default class CameraSetup extends React.PureComponent<
  CameraSetupProps,
  CameraSetupState
> {
  state: CameraSetupState = {
    currentState: { type: "requestingPermission" },
  };

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

  setError(error: Error) {
    this.setState({ currentState: { type: "error", error } });
  }

  requestMediaTrack() {
    const supported = "mediaDevices" in navigator;

    if (!supported) {
      this.setError(
        new Error(
          "navigator.mediaDevices not supported, " +
            "this could mean you're visiting the site from http and not https" +
            "or your device doesn't have a camera"
        )
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          // "user" for front facing camera, "environment" for rear
          facingMode: { ideal: "user" },
          frameRate: { ideal: 2 },
        },
        audio: false,
      })
      .then(
        (mediaStream) => {
          if (this.videoRef.current) {
            const video = this.videoRef.current;
            video.srcObject = mediaStream;
            video.play();
          } else {
            throw new Error("gosh");
          }

          const canvas = this.canvasRef.current;
          if (!canvas) {
            throw new Error("canvas ref not valid");
          }

          const video = this.videoRef.current;
          if (!video) {
            throw new Error("video ref not valid");
          }

          this.setState({
            currentState: {
              type: "ready",
              camera: new Camera(canvas, video),
            },
          });

          setTimeout(() => {
            const { currentState } = this.state;

            console.log("timeout");
            if (currentState.type === "ready") {
            }
          }, 1000);
        },
        (error) => {
          this.setError(error);
        }
      );
  }

  componentDidMount() {
    this.requestMediaTrack();
  }

  render() {
    const { onCapture } = this.props;
    const { currentState } = this.state;

    return (
      <div>
        <h1>
          {currentState.type === "requestingPermission"
            ? "Accept the dialog, human."
            : currentState.type === "error"
            ? `${currentState.error}`
            : null}
        </h1>
        {currentState.type === "ready" ? (
          <CameraSnapshotter
            camera={currentState.camera}
            onCapture={onCapture}
            interval={4}
          />
        ) : null}
        <video
          ref={this.videoRef}
          onCanPlay={() => {
            console.log("canplay");

            if (this.videoRef.current && this.canvasRef.current) {
              const video = this.videoRef.current;
              const canvas = this.canvasRef.current;

              const width = 320;
              const height = video.videoHeight / (video.videoWidth / width);

              video.width = width;
              video.height = height;
              canvas.width = width;
              canvas.height = height;
            } else {
              throw new Error("videoRef or canvasRef undefined");
            }
          }}
        />
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}
