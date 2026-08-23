const request = require("supertest");
const app = require("../server");

describe("Authentication API", () => {
  test("should register a user", async () => {
    const user = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Registration successful");
  });

  test("should reject invalid login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(401);
  });
});