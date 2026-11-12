const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be configured before the Prisma client is loaded");
}

const adapter = new PrismaPg({ connectionString });
module.exports = new PrismaClient({ adapter });
