import axios from "axios";
import { logger } from "./logger";

// https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236
const FACE_API =
  "https://ajskdlfjkalsdfasdf.cognitiveservices.azure.com/face/v1.0/detect";

const FACE_KEY = "b1320c7f356f465d90111e399942d7fc";

const api = axios.create({
  method: "post",
  baseURL: FACE_API + "?returnFaceAttributes=age,gender,emotion",
  headers: {
    "Ocp-Apim-Subscription-Key": FACE_KEY,
  },
});

export interface FaceData {
  faceId: string;
  faceRectangle: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  faceAttributes: {
    gender: "male" | "female";
    age: number;
    emotion: {
      // between 0-1
      anger: number;
      contempt: number;
      disgust: number;
      fear: number;
      happiness: number;
      neutral: number;
      sadness: number;
      surprise: number;
    };
  };
}

export type FaceApiResponse = FaceData[];

export async function getFacesFromData(
  data: Blob | Buffer
): Promise<FaceApiResponse> {
  logger.info(
    `uploading ${data instanceof Buffer ? data.length : data.size} bytes`
  );

  const response = await api({
    headers: {
      "Content-Type": "application/octet-stream",
    },
    data,
  });

  return response.data;
}

export async function getFacesFromUrl(url: string): Promise<FaceApiResponse> {
  logger.info(`uploading ${url}`);

  const response = await api({
    headers: {
      "Content-Type": "application/json",
    },

    data: {
      url,
    },
  });

  return response.data;
}
