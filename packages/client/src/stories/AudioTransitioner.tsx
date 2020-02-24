import React from "react";
import AudioTransitioner from "../AudioTransitioner";

export default {
  title: "AudioTransitioner",
  component: AudioTransitioner,
};

export const Basic = () => (
  <AudioTransitioner
    urls={[
      "https://github.com/Metastruct/garrysmod-chatsounds/raw/master/sound/chatsounds/autoadd/weeb/nep%20song.ogg",
      "https://github.com/Metastruct/garrysmod-chatsounds/raw/master/sound/chatsounds/autoadd/music/triple%20x%20rated.ogg",
      "https://github.com/Metastruct/garrysmod-chatsounds/raw/master/sound/chatsounds/autoadd/dhmis2/theres%20always%20time%20for%20a%20song.ogg",
      "https://github.com/Metastruct/garrysmod-chatsounds/raw/master/sound/chatsounds/autoadd/music/dontloseyourway.ogg",
      "https://github.com/Metastruct/garrysmod-chatsounds/raw/master/sound/chatsounds/autoadd/verbalsilence/geddan%20song.ogg",
    ]}
  />
);
