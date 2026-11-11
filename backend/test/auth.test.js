const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const http = require("node:http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-only-secret-that-is-at-least-32-characters";

const app = require("../src/app");
const prisma = require("../src/config/database");

let server;
let baseUrl;
const users = [];

function findUser(where) {
  if (where.email) return users.find((user) => user.email === where.email) || null;
  if (where.id) return users.find((user) => user.id === where.id) || null;
  return null;
}

before(async () => {
  prisma.user.findUnique = async ({ where }) => findUser(where);
  prisma.user.create = async ({ data }) => {
    const user = {
      id: users.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return user;
  };

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await prisma.$disconnect();
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return { status: response.status, body: await response.json() };
}

const validRegistration = {
  name: "Farmer One",
  email: "Farmer@One.example",
  password: "StrongPass1",
  phone: "555-0100",
};

test("registration validates required and weak fields", async () => {
  for (const body of [
    { email: validRegistration.email, password: validRegistration.password },
    { name: validRegistration.name, password: validRegistration.password },
    { name: validRegistration.name, email: "not-an-email", password: validRegistration.password },
    { name: validRegistration.name, email: validRegistration.email },
    { name: validRegistration.name, email: validRegistration.email, password: "weak" },
  ]) {
    const result = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    assert.equal(result.status, 400);
  }
});

test("registration hashes the password and returns a safe profile", async () => {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(validRegistration),
  });

  assert.equal(result.status, 201);
  assert.deepEqual(result.body.user.email, "farmer@one.example");
  assert.equal("passwordHash" in result.body.user, false);
  assert.equal("password" in result.body.user, false);
  assert.notEqual(users[0].passwordHash, validRegistration.password);
  assert.equal(await bcrypt.compare(validRegistration.password, users[0].passwordHash), true);
});

test("duplicate registration is rejected", async () => {
  const result = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...validRegistration, email: " FARMER@ONE.EXAMPLE " }),
  });
  assert.equal(result.status, 409);
});

test("login returns a JWT for valid credentials", async () => {
  const result = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "FARMER@ONE.EXAMPLE",
      password: validRegistration.password,
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(typeof result.body.token, "string");
  const payload = jwt.verify(result.body.token, process.env.JWT_SECRET);
  assert.equal(payload.sub, "1");
  assert.equal("passwordHash" in result.body.user, false);
});

test("login rejects incorrect, unknown, and missing credentials uniformly", async () => {
  for (const body of [
    { email: validRegistration.email, password: "WrongPass1" },
    { email: "unknown@example.com", password: validRegistration.password },
    { email: "not-an-email", password: validRegistration.password },
    {},
  ]) {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    assert.ok([400, 401].includes(result.status));
    if (result.status === 401) assert.equal(result.body.error, "Invalid email or password");
  }
});

test("protected profile rejects missing, malformed, invalid, and expired tokens", async () => {
  const expired = jwt.sign({ sub: "1" }, process.env.JWT_SECRET, { expiresIn: -1 });
  for (const token of [null, "not-a-jwt", jwt.sign({ sub: "1" }, "wrong-secret"), expired]) {
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    const result = await request("/api/auth/me", { headers });
    assert.equal(result.status, 401);
  }
});

test("protected profile returns only the authenticated user's safe data", async () => {
  const login = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: validRegistration.email,
      password: validRegistration.password,
    }),
  });
  const result = await request("/api/auth/me", {
    headers: { authorization: `Bearer ${login.body.token}` },
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.user.id, 1);
  assert.equal("passwordHash" in result.body.user, false);
  assert.equal("password" in result.body.user, false);
});
