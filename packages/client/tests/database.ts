import { expect } from "chai";
import { getUsers } from "../src/database";

describe("database", () => {
  it("get users", async () => {
    const users = await getUsers();

    expect(users).to.be.lengthOf(1);
    expect(users[0].name).to.equal("nameee");
  });
});
