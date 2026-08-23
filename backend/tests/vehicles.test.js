const request = require("supertest");
const app = require("../server");

describe("Vehicles API", () => {
  test("admin can add a vehicle", async () => {
    const email = `admin${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email,
        password: "password123",
        role: "admin",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 2500000,
        quantity: 5,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.make).toBe("Toyota");
  });

  test("normal user cannot add a vehicle", async () => {
    const email = `user${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email,
        password: "password123",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 3,
      });

    expect(response.statusCode).toBe(403);
  });

  test("should return all vehicles", async () => {
    const response = await request(app).get("/api/vehicles");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should search vehicles by make", async () => {
    const response = await request(app)
      .get("/api/vehicles/search?make=Toyota");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("admin can update a vehicle", async () => {
    const email = `adminupdate${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email,
        password: "password123",
        role: "admin",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const create = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 5,
      });

    const response = await request(app)
      .put(`/api/vehicles/${create.body._id}`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        price: 1600000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.price).toBe(1600000);
  });

  test("normal user cannot update a vehicle", async () => {
    const email = `normalupdate${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email,
        password: "password123",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const response = await request(app)
      .put("/api/vehicles/invalid-id")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        price: 1000000,
      });

    expect(response.statusCode).toBe(403);
  });

  test("admin can delete a vehicle", async () => {
    const email = `admindelete${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email,
        password: "password123",
        role: "admin",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const create = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        make: "BMW",
        model: "X5",
        category: "SUV",
        price: 7500000,
        quantity: 2,
      });

    const response = await request(app)
      .delete(`/api/vehicles/${create.body._id}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.statusCode).toBe(200);
  });

  test("user can purchase a vehicle", async () => {
    const adminEmail = `adminpurchase${Date.now()}@example.com`;
    const userEmail = `userpurchase${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: adminEmail,
        password: "password123",
        role: "admin",
      });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: "password123",
      });

    const create = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4000000,
        quantity: 2,
      });

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email: userEmail,
        password: "password123",
      });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: userEmail,
        password: "password123",
      });

    const response = await request(app)
      .post(`/api/vehicles/${create.body._id}/purchase`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.vehicle.quantity).toBe(1);
  });

  test("cannot purchase vehicle when stock is zero", async () => {
    const adminEmail = `adminstock${Date.now()}@example.com`;
    const userEmail = `userstock${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: adminEmail,
        password: "password123",
        role: "admin",
      });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: "password123",
      });

    const create = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send({
        make: "Audi",
        model: "A4",
        category: "Sedan",
        price: 4500000,
        quantity: 0,
      });

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "User",
        email: userEmail,
        password: "password123",
      });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: userEmail,
        password: "password123",
      });

    const response = await request(app)
      .post(`/api/vehicles/${create.body._id}/purchase`)
      .set("Authorization", `Bearer ${userLogin.body.token}`);

    expect(response.statusCode).toBe(400);
  });

  test("admin can restock a vehicle", async () => {
    const email = `adminrestock${Date.now()}@example.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email,
        password: "password123",
        role: "admin",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

    const create = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        make: "Kia",
        model: "Seltos",
        category: "SUV",
        price: 2000000,
        quantity: 2,
      });

    const response = await request(app)
      .post(`/api/vehicles/${create.body._id}/restock`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        quantity: 3,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.vehicle.quantity).toBe(5);
  });

  test("should reject a vehicle with negative price", async () => {
  const email = `adminprice${Date.now()}@example.com`;

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Admin",
      email,
      password: "password123",
      role: "admin",
    });

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "password123",
    });

  const response = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${login.body.token}`)
    .send({
      make: "Toyota",
      model: "Camry",
      category: "Sedan",
      price: -100,
      quantity: 5,
    });

  expect(response.statusCode).toBe(400);
});

test("should reject negative restock quantity", async () => {
  const email = `adminrestockvalidation${Date.now()}@example.com`;

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Admin",
      email,
      password: "password123",
      role: "admin",
    });

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "password123",
    });

  const create = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${login.body.token}`)
    .send({
      make: "Kia",
      model: "Seltos",
      category: "SUV",
      price: 2000000,
      quantity: 2,
    });

  const response = await request(app)
    .post(`/api/vehicles/${create.body._id}/restock`)
    .set("Authorization", `Bearer ${login.body.token}`)
    .send({
      quantity: -5,
    });

  expect(response.statusCode).toBe(400);
});

test("should reject unauthenticated vehicle creation", async () => {
  const response = await request(app)
    .post("/api/vehicles")
    .send({
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      price: 1800000,
      quantity: 5,
    });

  expect(response.statusCode).toBe(401);
});
});