import fs from "fs";
import path from "path";
import { getFacesFromUrl, getFacesFromData, FaceData } from "../face";

describe("face", () => {
  function testSquishThatCat(faces: FaceData[]) {
    expect(faces).toHaveLength(1);

    const face = faces[0];
    expect(face.faceAttributes.gender).toEqual("male");
  }

  it("by url", async () => {
    testSquishThatCat(
      await getFacesFromUrl("https://files.catbox.moe/x6ef75.png")
    );
  });

  it("by file", async () => {
    testSquishThatCat(
      await getFacesFromData(fs.readFileSync(path.join(__dirname, "image.png")))
    );
  });
});
