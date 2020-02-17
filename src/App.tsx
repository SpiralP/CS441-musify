import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CameraSnapshotter from "./CameraSnapshotter";

// export default function App() {
//   const onDrop = useCallback((acceptedFiles) => {
//     acceptedFiles.forEach((file: Blob) => {
//       const reader = new FileReader();

//       reader.onabort = () => console.log("file reading was aborted");
//       reader.onerror = () => console.log("file reading has failed");
//       reader.onload = () => {
//         const data = reader.result as ArrayBuffer;
//         uploadData(data);
//       };

//       reader.readAsArrayBuffer(file);
//     });
//   }, []);
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   return (
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />
//       <p>Drag 'n' drop some files here, or click to select files</p>
//     </div>
//   );
// }

export default function App() {
  return (
    <div>
      <CameraSnapshotter />
    </div>
  );
}
