const TARGET_WIDTH = 960;

export default class Camera {
  public canvas: HTMLCanvasElement;
  public video: HTMLVideoElement;

  private constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    this.canvas = canvas;
    this.video = video;
  }

  static async setup() {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const supported = "mediaDevices" in navigator;

    if (!supported) {
      throw new Error(
        "navigator.mediaDevices not supported, " +
          "this could mean you're visiting the site from http and not https" +
          "or your device doesn't have a camera"
      );
    }

    const canplayPromise = new Promise((resolve, reject) => {
      video.addEventListener("error", reject);

      // canplay fires after play :(
      video.addEventListener("canplay", () => {
        const width = Math.min(TARGET_WIDTH, video.videoWidth);
        const height = video.videoHeight / (video.videoWidth / width);

        video.width = width;
        video.height = height;
        canvas.width = width;
        canvas.height = height;

        resolve();
      });
    });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        // "user" for front facing camera, "environment" for rear
        facingMode: { ideal: "user" },
        frameRate: { ideal: 2 },
      },
      audio: false,
    });

    video.srcObject = mediaStream;
    video.play();

    // after canplay you can capture
    await canplayPromise;

    return new Camera(canvas, video);
  }

  async capture() {
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("2d context not valid");
    }

    context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const blob: Blob = await new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("couldn't into Blob");
        }

        resolve(blob);
      });
    });

    return blob;
  }
}
