// Seeds the Disease table. Run with: node prisma/seed.js  (from the backend folder)
// Uses upsert so it is safe to run multiple times.

const { PrismaClient } = require("@prisma/client");
const diseases = require("./data/diseases");

const prisma = new PrismaClient();

async function main() {
  for (const disease of diseases) {
    await prisma.disease.upsert({
      where: { name: disease.name },
      update: disease,
      create: disease,
    });
  }
  console.log(`Seeded ${diseases.length} diseases`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
