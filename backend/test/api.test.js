process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";

const assert = require("node:assert/strict");
const http = require("node:http");
const { before, after, beforeEach, test } = require("node:test");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const prisma = require("../src/config/database");
const { createToken } = require("../src/controllers/auth.controller");
let lastCreatedUser;

const user = {
  id: 1,
  name: "Vanshika",
  email: "vanshika@example.com",
  passwordHash: bcrypt.hashSync("correct-password", 4),
  phone: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

function request(server, path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body === undefined ? undefined : JSON.stringify(options.body);
    const req = http.request({
      host: "127.0.0.1",
      port: server.address().port,
      method: options.method || "GET",
      path,
      headers: {
        ...(body ? { "content-type": "application/json", "content-length": Buffer.byteLength(body) } : {}),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      },
    }, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => { responseBody += chunk; });
      res.on("end", () => resolve({
        status: res.statusCode,
        body: responseBody ? JSON.parse(responseBody) : null,
      }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

before(async () => {
  await new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      global.testServer = server;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => global.testServer.close(resolve));
  await prisma.$disconnect();
});

beforeEach(() => {
  lastCreatedUser = null;
  prisma.user = {
    findUnique: async ({ where }) => where.email === user.email || where.id === user.id ? { ...user } : null,
    create: async ({ data }) => {
      lastCreatedUser = { ...user, ...data, id: 2 };
      return lastCreatedUser;
    },
    update: async ({ data }) => ({ ...user, ...data }),
  };
  prisma.farm = {
    create: async ({ data }) => ({ id: 10, createdAt: new Date(), updatedAt: new Date(), ...data }),
    findMany: async () => [],
    findFirst: async () => null,
    update: async ({ data }) => ({ id: 10, ...data }),
    delete: async () => undefined,
  };
  prisma.crop = {
    create: async ({ data }) => ({ id: 30, createdAt: new Date(), updatedAt: new Date(), ...data }),
    findMany: async () => [],
    findFirst: async () => null,
    update: async ({ data }) => ({ id: 30, ...data }),
    delete: async () => undefined,
  };
  prisma.field = {
    create: async ({ data }) => ({ id: 40, createdAt: new Date(), updatedAt: new Date(), ...data }),
    findMany: async () => [],
    findFirst: async () => null,
    update: async ({ data }) => ({ id: 40, ...data }),
    delete: async () => undefined,
  };
});

test("registers a user with a bcrypt hash and safe response", async () => {
  const response = await request(global.testServer, "/api/auth/register", {
    method: "POST",
    body: { name: "New User", email: "new@example.com", password: "strong-password" },
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.user.passwordHash, undefined);
  assert.equal(response.body.user.email, "new@example.com");
  assert.equal(await bcrypt.compare("strong-password", lastCreatedUser.passwordHash), true);
});

test("rejects duplicate, missing, invalid-email, and weak-password registration", async (t) => {
  prisma.user.findUnique = async () => ({ ...user });
  const duplicate = await request(global.testServer, "/api/auth/register", {
    method: "POST", body: { name: "New User", email: user.email, password: "strong-password" },
  });
  assert.equal(duplicate.status, 409);

  for (const body of [
    { email: "new@example.com", password: "strong-password" },
    { name: "New User", email: "invalid", password: "strong-password" },
    { name: "New User", email: "new@example.com", password: "short" },
  ]) {
    await t.test(JSON.stringify(body), async () => {
      const response = await request(global.testServer, "/api/auth/register", { method: "POST", body });
      assert.equal(response.status, 400);
    });
  }
});

test("logs in successfully and rejects incorrect credentials generically", async () => {
  const success = await request(global.testServer, "/api/auth/login", {
    method: "POST", body: { email: user.email, password: "correct-password" },
  });
  assert.equal(success.status, 200);
  assert.ok(success.body.token);
  assert.equal(success.body.user.passwordHash, undefined);

  const failure = await request(global.testServer, "/api/auth/login", {
    method: "POST", body: { email: user.email, password: "wrong-password" },
  });
  assert.equal(failure.status, 401);
  assert.equal(failure.body.error, "Invalid email or password");
});

test("protects current-user and profile endpoints", async () => {
  const missing = await request(global.testServer, "/api/auth/me");
  assert.equal(missing.status, 401);

  const token = createToken(user.id);
  const profile = await request(global.testServer, "/api/auth/me", { token });
  assert.equal(profile.status, 200);
  assert.equal(profile.body.user.email, user.email);
  assert.equal(profile.body.user.passwordHash, undefined);

  const updated = await request(global.testServer, "/api/users/profile", {
    method: "PUT", token, body: { name: "Updated Name", email: "attacker@example.com" },
  });
  assert.equal(updated.status, 400);
});

test("rejects invalid and expired JWTs", async () => {
  const invalid = await request(global.testServer, "/api/auth/me", { token: "not-a-token" });
  assert.equal(invalid.status, 401);

  const jwt = require("jsonwebtoken");
  const expired = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: -1, algorithm: "HS256" });
  const response = await request(global.testServer, "/api/auth/me", { token: expired });
  assert.equal(response.status, 401);
  assert.equal(response.body.error, "Authentication token expired");
});

test("creates, lists, updates, and deletes only owned farms", async () => {
  const token = createToken(user.id);
  prisma.farm.findFirst = async ({ where }) => where.userId === user.id ? {
    id: where.id, userId: user.id, farmName: "Green Farm", location: "Pune",
    totalArea: 4, soilType: "Loam", irrigationType: "Drip",
  } : null;
  prisma.farm.findMany = async ({ where }) => [{ id: 10, userId: where.userId }];

  const invalid = await request(global.testServer, "/api/farms", {
    method: "POST", token, body: { farmName: "A", totalArea: -1 },
  });
  assert.equal(invalid.status, 400);

  const created = await request(global.testServer, "/api/farms", {
    method: "POST", token,
    body: { farmName: "Green Farm", location: "Pune", totalArea: 4, soilType: "Loam", irrigationType: "Drip" },
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.farm.userId, user.id);

  const listed = await request(global.testServer, "/api/farms", { token });
  assert.equal(listed.status, 200);
  assert.equal(listed.body.farms[0].userId, user.id);

  const fetched = await request(global.testServer, "/api/farms/10", { token });
  assert.equal(fetched.status, 200);
  const updated = await request(global.testServer, "/api/farms/10", {
    method: "PUT", token, body: { soilType: "Sandy" },
  });
  assert.equal(updated.status, 200);
  const deleted = await request(global.testServer, "/api/farms/10", { method: "DELETE", token });
  assert.equal(deleted.status, 204);
});

test("does not expose another user's farms", async () => {
  const token = createToken(user.id);
  prisma.farm.findFirst = async () => null;
  const response = await request(global.testServer, "/api/farms/999", { token });
  assert.equal(response.status, 404);
});

test("creates and lists crops only under an owned farm", async () => {
  const token = createToken(user.id);
  let createdData;
  let listWhere;
  prisma.farm.findFirst = async ({ where }) => where.id === 20 && where.userId === user.id ? { id: 20 } : null;
  prisma.crop.create = async ({ data }) => {
    createdData = data;
    return { id: 30, createdAt: new Date(), updatedAt: new Date(), ...data };
  };
  prisma.crop.findMany = async ({ where }) => {
    listWhere = where;
    return [{ id: 30, cropName: "Tomato", farmId: 20 }];
  };

  const unauthorized = await request(global.testServer, "/api/farms/20/crops");
  assert.equal(unauthorized.status, 401);

  const invalid = await request(global.testServer, "/api/farms/20/crops", {
    method: "POST", token, body: { cropName: "T" },
  });
  assert.equal(invalid.status, 400);

  const invalidDate = await request(global.testServer, "/api/farms/20/crops", {
    method: "POST", token, body: { cropName: "Tomato", plantingDate: "2026-02-31" },
  });
  assert.equal(invalidDate.status, 400);

  const otherFarm = await request(global.testServer, "/api/farms/21/crops", {
    method: "POST", token, body: { cropName: "Tomato" },
  });
  assert.equal(otherFarm.status, 404);

  const missingFarm = await request(global.testServer, "/api/farms/21/crops", { token });
  assert.equal(missingFarm.status, 404);

  const created = await request(global.testServer, "/api/farms/20/crops", {
    method: "POST",
    token,
    body: {
      cropName: " Tomato ",
      cropVariety: " Roma ",
      plantingDate: "2026-03-01",
      expectedHarvestDate: "2026-07-01",
      growthStage: "Flowering",
      farmId: 21,
    },
  });
  assert.equal(created.status, 400);

  const valid = await request(global.testServer, "/api/farms/20/crops", {
    method: "POST",
    token,
    body: {
      cropName: " Tomato ",
      cropVariety: " Roma ",
      plantingDate: "2026-03-01",
      expectedHarvestDate: "2026-07-01",
      growthStage: "Flowering",
    },
  });
  assert.equal(valid.status, 201);
  assert.equal(valid.body.crop.cropName, "Tomato");
  assert.equal(createdData.farmId, 20);
  assert.equal(createdData.plantingDate.toISOString(), "2026-03-01T00:00:00.000Z");

  const listed = await request(global.testServer, "/api/farms/20/crops", { token });
  assert.equal(listed.status, 200);
  assert.equal(listed.body.crops[0].farmId, 20);
  assert.deepEqual(listWhere, { farmId: 20 });
});

test("gets, updates, and deletes only crops owned through the farm", async () => {
  const token = createToken(user.id);
  let updateData;
  let deleteCount = 0;
  const ownedCrop = { id: 30, cropName: "Tomato", farmId: 20 };
  prisma.crop.findFirst = async ({ where }) => (
    where.id === 30 && where.farm?.is?.userId === user.id ? ownedCrop : null
  );
  prisma.crop.update = async ({ data }) => {
    updateData = data;
    return { ...ownedCrop, ...data };
  };
  prisma.crop.delete = async () => { deleteCount += 1; };

  const unauthorized = await request(global.testServer, "/api/crops/30");
  assert.equal(unauthorized.status, 401);

  const invalidId = await request(global.testServer, "/api/crops/not-an-id", { token });
  assert.equal(invalidId.status, 400);

  const fetched = await request(global.testServer, "/api/crops/30", { token });
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.crop.id, 30);

  const invalidUpdate = await request(global.testServer, "/api/crops/30", {
    method: "PUT", token, body: {},
  });
  assert.equal(invalidUpdate.status, 400);

  const updated = await request(global.testServer, "/api/crops/30", {
    method: "PUT", token, body: { growthStage: "Mature" },
  });
  assert.equal(updated.status, 200);
  assert.equal(updateData.growthStage, "Mature");

  const inaccessible = await request(global.testServer, "/api/crops/31", {
    method: "PUT", token, body: { cropName: "Wheat" },
  });
  assert.equal(inaccessible.status, 404);
  const inaccessibleDelete = await request(global.testServer, "/api/crops/31", {
    method: "DELETE", token,
  });
  assert.equal(inaccessibleDelete.status, 404);
  assert.equal(deleteCount, 0);

  const deleted = await request(global.testServer, "/api/crops/30", {
    method: "DELETE", token,
  });
  assert.equal(deleted.status, 204);
  assert.equal(deleteCount, 1);
});

test("creates and lists fields only under an owned farm", async () => {
  const token = createToken(user.id);
  let createdData;
  let listWhere;
  prisma.farm.findFirst = async ({ where }) => where.id === 20 && where.userId === user.id ? { id: 20 } : null;
  prisma.field.create = async ({ data }) => {
    createdData = data;
    return { id: 40, createdAt: new Date(), updatedAt: new Date(), ...data };
  };
  prisma.field.findMany = async ({ where }) => {
    listWhere = where;
    return [{ id: 40, fieldName: "North Field", area: 2.5, farmId: 20 }];
  };

  const unauthorized = await request(global.testServer, "/api/farms/20/fields");
  assert.equal(unauthorized.status, 401);

  const invalidArea = await request(global.testServer, "/api/farms/20/fields", {
    method: "POST", token, body: { fieldName: "North Field", area: -1 },
  });
  assert.equal(invalidArea.status, 400);

  const invalidBody = await request(global.testServer, "/api/farms/20/fields", {
    method: "POST", token, body: { fieldName: "North Field", area: 2.5, farmId: 21 },
  });
  assert.equal(invalidBody.status, 400);

  const otherFarm = await request(global.testServer, "/api/farms/21/fields", {
    method: "POST", token, body: { fieldName: "North Field", area: 2.5 },
  });
  assert.equal(otherFarm.status, 404);

  const missingFarm = await request(global.testServer, "/api/farms/21/fields", { token });
  assert.equal(missingFarm.status, 404);

  const created = await request(global.testServer, "/api/farms/20/fields", {
    method: "POST",
    token,
    body: { fieldName: " North Field ", area: "2.5", soilType: " Loam ", irrigationType: " Drip " },
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.field.fieldName, "North Field");
  assert.equal(createdData.area, 2.5);
  assert.equal(createdData.farmId, 20);
  assert.equal(createdData.soilType, "Loam");

  const listed = await request(global.testServer, "/api/farms/20/fields", { token });
  assert.equal(listed.status, 200);
  assert.equal(listed.body.fields[0].farmId, 20);
  assert.deepEqual(listWhere, { farmId: 20 });
});

test("gets, updates, and deletes only fields owned through the farm", async () => {
  const token = createToken(user.id);
  let updateData;
  let deleteCount = 0;
  const ownedField = { id: 40, fieldName: "North Field", area: 2.5, farmId: 20 };
  prisma.field.findFirst = async ({ where }) => (
    where.id === 40 && where.farm?.is?.userId === user.id ? ownedField : null
  );
  prisma.field.update = async ({ data }) => {
    updateData = data;
    return { ...ownedField, ...data };
  };
  prisma.field.delete = async () => { deleteCount += 1; };

  const unauthorized = await request(global.testServer, "/api/fields/40");
  assert.equal(unauthorized.status, 401);

  const invalidId = await request(global.testServer, "/api/fields/invalid", { token });
  assert.equal(invalidId.status, 400);

  const fetched = await request(global.testServer, "/api/fields/40", { token });
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.field.fieldName, "North Field");

  const invalidUpdate = await request(global.testServer, "/api/fields/40", {
    method: "PUT", token, body: {},
  });
  assert.equal(invalidUpdate.status, 400);

  const updated = await request(global.testServer, "/api/fields/40", {
    method: "PUT", token, body: { area: 3 },
  });
  assert.equal(updated.status, 200);
  assert.equal(updateData.area, 3);

  const inaccessible = await request(global.testServer, "/api/fields/41", {
    method: "PUT", token, body: { fieldName: "South Field" },
  });
  assert.equal(inaccessible.status, 404);
  const inaccessibleDelete = await request(global.testServer, "/api/fields/41", {
    method: "DELETE", token,
  });
  assert.equal(inaccessibleDelete.status, 404);
  assert.equal(deleteCount, 0);

  const deleted = await request(global.testServer, "/api/fields/40", {
    method: "DELETE", token,
  });
  assert.equal(deleted.status, 204);
  assert.equal(deleteCount, 1);
});
