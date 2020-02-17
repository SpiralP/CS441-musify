import React from "react";
import { getFacesFromData } from "./face";
import { logger } from "./logger";

interface CameraSnapshotterState {
  currentState:
    | { type: "requesting" }
    | { type: "error"; error: Error }
    | { type: "ready"; message?: string };
}

export default class CameraSnapshotter extends React.PureComponent<
  {},
  CameraSnapshotterState
> {
  state: CameraSnapshotterState = {
    currentState: { type: "requesting" },
  };

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

  setError(error: Error) {
    this.setState({ currentState: { type: "error", error } });
  }
  requestMediaTrack() {
    const supported = "mediaDevices" in navigator;

    if (supported) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            // front facing camera, "environment" for rear
            facingMode: "user",
            frameRate: { ideal: 2 },
          },
          audio: false,
        })
        .then(
          (mediaStream) => {
            // const mediaStreamTracks = mediaStream.getVideoTracks();
            // if (mediaStreamTracks.length === 0) {
            //   this.setError(new Error("getVideoTracks().length is 0"));
            // } else {

            if (this.videoRef.current) {
              const video = this.videoRef.current;
              video.srcObject = mediaStream;
              video.play();
            } else {
              throw new Error("gosh");
            }

            // const mediaStreamTrack = mediaStreamTracks[0];
            // const imageCapture = new ImageCapture(mediaStreamTrack);

            // console.log(imageCapture);

            this.setState({ currentState: { type: "ready" } });

            setTimeout(() => {
              const { currentState } = this.state;

              logger.debug("timeout");
              if (currentState.type === "ready") {
                if (this.videoRef.current && this.canvasRef.current) {
                  const video = this.videoRef.current;
                  const canvas = this.canvasRef.current;

                  const context = canvas.getContext("2d");
                  if (!context) {
                    throw new Error("2d context null??");
                  }

                  context.drawImage(video, 0, 0, canvas.width, canvas.height);

                  logger.debug("snapshot");
                  this.setState({
                    currentState: { type: "ready", message: "snapshotting" },
                  });

                  canvas.toBlob((blob) => {
                    if (!blob) {
                      throw new Error("couldn't into Blob");
                    }

                    getFacesFromData(blob).then((data) => {
                      console.log(data);

                      if (data.length !== 0) {
                        const message = JSON.stringify(
                          data[0].faceAttributes,
                          null,
                          1
                        );
                        console.log("ready", message);
                        this.setState({
                          currentState: { type: "ready", message },
                        });
                      } else {
                        this.setState({
                          currentState: { type: "ready", message: "no result" },
                        });
                      }
                    });
                  });
                  // console.log(response.data);
                }
              }
            }, 1000);
          },
          (error) => {
            this.setError(error);
          }
        );
    } else {
      this.setError(
        new Error(
          "navigator.mediaDevices not supported, " +
            "this could mean you're visiting the site from http and not https" +
            "or your device doesn't have a camera"
        )
      );
    }
  }

  componentDidMount() {
    this.requestMediaTrack();
  }

  render() {
    const { currentState } = this.state;

    return (
      <div>
        <h1>
          {currentState.type === "requesting"
            ? "Accept the dialog, human."
            : currentState.type === "error"
            ? `${currentState.error}`
            : currentState.type === "ready"
            ? currentState.message
              ? `${currentState.message}`
              : "ready!"
            : null}
        </h1>
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
