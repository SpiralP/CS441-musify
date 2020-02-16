import axios from "axios";

export async function uploadData(data: Blob) {
  console.log("uploading", data);

  const response = await axios({
    method: "post",
    url:
      "https://ajskdlfjkalsdfasdf.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,emotion",
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": "b1320c7f356f465d90111e399942d7fc",
    },

    // TODO allow user to input url to picture, use json
    // { url: "http://put.nu/files/VPT2ofA.png" }

    data,
  });

  return response.data;
}
