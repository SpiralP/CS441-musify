export default class Camera {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;

  constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    this.canvas = canvas;
    this.video = video;
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
