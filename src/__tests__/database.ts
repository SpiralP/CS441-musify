import { getUsers } from "../database";

describe("database", () => {
  it("get users", async () => {
    const users = await getUsers();

    expect(users).toHaveLength(1);
    expect(users[0].name).toEqual("nameee");
  });
});
