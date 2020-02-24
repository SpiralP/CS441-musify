import React, { useState } from "react";
import CameraSnapshotter from "../CameraSnapshotter";
import Loader from "../Loader";
import Camera from "../Camera";

export default {
  title: "CameraSnapshotter",
  component: CameraSnapshotter,
};

function Thing() {
  const [url, setUrl] = useState("");

  return (
    <>
      <Loader
        promise={() => Camera.setup()}
        renderError={(error) => `Camera error: ${error}`}
        renderLoading={() => "loading camera"}
        renderSuccess={(camera) => (
          <CameraSnapshotter
            camera={camera}
            interval={1000}
            onCapture={(blob) => {
              setUrl(URL.createObjectURL(blob));
            }}
          />
        )}
      />

      <img alt="" src={url} onClick={() => {}} />
    </>
  );
}

export const Basic = () => <Thing />;

// async function upload(blob: Blob) {
//   var formData = new FormData();

//   formData.append("qquuid", "87670de6-5ad3-4f1e-8a3f-be97a789e4ce");
//   formData.append("qqtotalfilesize", "298");
//   formData.append("file", blob);

//   // Make the axios request
//   const ag = await axios.post("https://file.io/", formData);
//   console.log(ag.data.link);
// }
