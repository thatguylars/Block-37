const { faker } = require("@faker-js/faker");
require("dotenv").config();
const { getPrisma} = require("../db/common");

async function seed() {
  const prisma = await getPrisma();
  console.log("Seeding the database...");

  try {
    const users = await prisma.user.createMany({
      data: [...Array(10)].map(() => ({
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.username() + Math.floor(Math.random() * 1000),
      })),
    });

    console.log(`Created ${users.count} users.`);

    const items = await prisma.item.createMany({
      data: [...Array(20)].map(() => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.url(),
      })),
    });

    console.log(`Created ${items.count} items.`);

    const userIds = await prisma.user.findMany({ select: { id: true } });
    const itemIds = await prisma.item.findMany({ select: { id: true } });

    const reviews = await Promise.all(
      [...Array(10)].map(async (_, i) => {
        const userId = userIds[i % userIds.length].id;
        const itemId = itemIds[i % itemIds.length].id;
        return prisma.review.create({
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

        return prisma.comment.create({
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
