const supertest = require("supertest");
const app = require("../app");
const { connect } = require("./database");

describe("Authentication test", () => {
  let connection;
  beforeAll(async () => {
    connection = await connect();
  });

  beforeEach(async () => {
    await connection.cleanup();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should successfully signup a user", async () => {
    const response = await supertest(app).post("/users/sign-up").set("content-type", "application/json").send({
      first_name: "Jack",
      last_name: "Doe",
      email: "jackdoe@example.com",
      password: "jack123",
      username: "Jack",
    });

    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      first_name: "Jack",
      last_name: "Doe",
      email: "jackdoe@example.com",
      username: "Jack",
    });
  });
});
