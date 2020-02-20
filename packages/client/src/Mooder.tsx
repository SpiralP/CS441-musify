import React from "react";
import { FaceApiResponse } from "./face";

interface MooderProps {
  data: FaceApiResponse;
}

export default class Mooder extends React.PureComponent<MooderProps, {}> {
  render() {
    const { data } = this.props;

    if (data.length === 0) {
      return "no results!";
    } else {
      const face = data[0];

      let mostEmotion = "";
      let mostEmotionWeight = 0;
      Object.entries(face.faceAttributes.emotion).forEach(
        ([emotion, weight]) => {
          if (!mostEmotion || weight > mostEmotionWeight) {
            mostEmotionWeight = weight;
            mostEmotion = emotion;
          }
        }
      );

      return mostEmotion;
    }
  }
}
