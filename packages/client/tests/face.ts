import fs from "fs";
import { expect } from "chai";
import { getFacesFromUrl, getFacesFromData, FaceData } from "../src/face";
import { inspect } from "../src/helpers";

describe("face", () => {
  function testSquishThatCat(faces: FaceData[]) {
    expect(faces).to.have.lengthOf(1);

    const face = faces[0];
    expect(face.faceAttributes.gender).to.equal("male");
  }

  it("by url", async () => {
    testSquishThatCat(
      await getFacesFromUrl("https://files.catbox.moe/x6ef75.png")
    );
  });

  it("by file", async () => {
    testSquishThatCat(
      await getFacesFromData(fs.readFileSync("tests/image.png"))
    );
  });
});
