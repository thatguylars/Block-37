const { faker } = require("@faker-js/faker");
const { prisma } = require("../db/common");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

async function seed() {
  console.log("Seeding the database...");

  try {
    const users = await prisma.User.createMany({
      data: [...Array(10)].map(() => ({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })),
    });

    console.log(`Created ${users.count} users.`);

    const items = await prisma.Item.createMany({
      data: [...Array(20)].map(() => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.url(),
      })),
    });

    console.log(`Created ${items.count} items.`);

    const userIds = await prisma.User.findMany({ select: { id: true } });
    const itemIds = await prisma.Item.findMany({ select: { id: true } });

    const reviews = await Promise.all(
      [...Array(10)].map(async (_, i) => {
        const userId = userIds[i % userIds.length].id;
        const itemId = itemIds[i % itemIds.length].id;
        return prisma.Review.create({
          data: {
            content: faker.lorem.paragraph(2),
            rating: faker.number.int({ min: 1, max: 5 }),
            userId: userId,
            itemId: itemId,
          },
        });
      }),
    );

    console.log(`Created ${reviews.length} reviews.`);

    const comments = await Promise.all(
      [...Array(10)].map(async (_, i) => {
        const userId = userIds[i % userIds.length].id;
        const reviewId = reviews[i % reviews.length].id;

        return prisma.Comment.create({
          data: {
            content: faker.lorem.paragraph(2),
            userId: userId,
            reviewId: reviewId,
          },
        });
      }),
    );

    console.log(`Created ${comments.length} comments.`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error); // Make sure to log the error!
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
