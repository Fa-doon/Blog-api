const supertest = require("supertest");
const app = require("../app");

describe("Home route", () => {
  it("should return Hello Blogger on calling the home route", async () => {
    const response = await supertest(app).get("/").set("content-type", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: `Hello Blogger`, success: true });
  });

  it("should return failure on calling a non existent route", async () => {
    const response = await supertest(app).get("/random").set("content-type", "application/json");

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ data: null, message: `Route not found` });
  });
});
