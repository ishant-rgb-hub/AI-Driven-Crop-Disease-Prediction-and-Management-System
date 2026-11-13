process.env.DATABASE_URL = "postgresql://localhost:5432/test";
process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { after, before, beforeEach, test } = require("node:test");
const app = require("../src/app");
const prisma = require("../src/config/database");
const { createToken } = require("../src/controllers/auth.controller");

const disease = {
  id: 1,
  name: "Tomato___Early_blight",
  cropName: "Tomato",
  displayName: "Early Blight",
  description: "A fungal disease.",
  symptoms: "Dark spots.",
  isHealthy: false,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};
const png = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cfc0000000040001" +
  "010018dd8db0000000049454e44ae426082",
  "hex",
);

function request(server, path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body;
    const headers = {
      ...(body ? { "content-type": options.contentType, "content-length": body.length } : {}),
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
    };
    const req = http.request({
      host: "127.0.0.1",
      port: server.address().port,
      method: options.method || "GET",
      path,
      headers,
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

function multipart(fields, file) {
  const boundary = `test-${Date.now()}`;
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  if (file) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${file.name}"\r\n` +
      `Content-Type: ${file.type}\r\n\r\n`,
    ));
    parts.push(file.data);
    parts.push(Buffer.from("\r\n"));
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` };
}

let server;
const createdFiles = new Set();

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
});

after(async () => {
  for (const filename of createdFiles) {
    await fs.rm(path.join(__dirname, "..", "uploads", filename), { force: true });
  }
  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
});

beforeEach(() => {
  prisma.cropImage = {
    create: async ({ data }) => {
      const record = {
        id: 1,
        uploadedAt: new Date("2026-01-01T00:00:00.000Z"),
        ...data,
      };
      createdFiles.add(path.basename(data.url));
      return record;
    },
    delete: async () => undefined,
  };
  prisma.crop = {
    findUnique: async () => null,
  };
  prisma.disease = {
    findUnique: async () => disease,
  };
  prisma.prediction = {
    create: async ({ data }) => ({
      id: 1,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      ...data,
      image: {
        id: data.imageId,
        url: "/uploads/test.png",
        filename: "leaf.png",
        uploadedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      disease,
    }),
    findMany: async () => [],
    findFirst: async () => null,
  };
});

test("requires authentication for predictions", async () => {
  const response = await request(server, "/api/predictions");
  assert.equal(response.status, 401);
});

test("rejects missing and invalid prediction images", async () => {
  const token = createToken(1);
  const missing = multipart({}, null);
  const missingResponse = await request(server, "/api/predictions", {
    method: "POST", token, ...missing,
  });
  assert.equal(missingResponse.status, 400);

  const pdf = multipart({}, { name: "leaf.pdf", type: "application/pdf", data: Buffer.from("pdf") });
  const pdfResponse = await request(server, "/api/predictions", {
    method: "POST", token, ...pdf,
  });
  assert.equal(pdfResponse.status, 400);
});

test("creates a prediction and returns the prediction shape", async () => {
  const token = createToken(1);
  const form = multipart({}, { name: "leaf.png", type: "image/png", data: png });
  const response = await request(server, "/api/predictions", {
    method: "POST", token, ...form,
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.image.filename, "leaf.png");
  assert.equal(response.body.disease.name, disease.name);
  assert.equal(response.body.cropId, null);
});

test("lists only owned predictions and hides another user's prediction", async () => {
  const token = createToken(1);
  const prediction = {
    id: 2,
    confidence: 0.8,
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
    cropId: null,
    image: { id: 2, url: "/uploads/leaf.png", filename: "leaf.png", uploadedAt: new Date() },
    disease,
  };
  prisma.prediction.findMany = async ({ where }) => where.userId === 1 ? [prediction] : [];
  prisma.prediction.findFirst = async ({ where }) => where.userId === 1 && where.id === 2 ? prediction : null;

  const list = await request(server, "/api/predictions", { token });
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].id, 2);

  const own = await request(server, "/api/predictions/2", { token });
  assert.equal(own.status, 200);

  const otherUser = await request(server, "/api/predictions/2", { token: createToken(2) });
  assert.equal(otherUser.status, 404);

  const missing = await request(server, "/api/predictions/999999", { token });
  assert.equal(missing.status, 404);
});
