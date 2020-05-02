import React from "react";
import { FaceApiResponse } from "./face";
import SoundcloudPlaylist from "./SoundcloudPlaylist";

interface MooderProps {
  data: FaceApiResponse;
}

const emotionToGenre: {
  [emotion: string]: string[];
} = {
  anger: ["heavy metal", "rap", "hardbass"],
  contempt: ["punk rock", "emo"],
  disgust: ["death metal"],
  fear: ["classical"],
  happiness: ["happy", "rock", "pop"],
  neutral: ["ambient", "classical"],
  sadness: ["sad", "blues", "lo-fi"],
  surprise: ["happy", "rock", "pop"],
};

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

      const genres = emotionToGenre[mostEmotion];
      const genre = genres[Math.floor(Math.random() * genres.length)];

      return (
        <h2>
          {`${Math.floor(
            mostEmotionWeight * 100
          )}% ${mostEmotion} - ${genre} music`}
          <SoundcloudPlaylist autoPlay genre={genre} />
        </h2>
      );
    }
  }
}
