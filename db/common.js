// const { PrismaClient } = require("@prisma/client");

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//     console.log("Prisma client initialized (global)");
//   }
//   prisma = global.prisma;
// }
// console.log("Prisma instance:", prisma);

// module.exports = { prisma };
const { PrismaClient } = require("@prisma/client");

let prisma;

async function getPrismaClient() {
  // Make this an async function
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
      console.log("Prisma client initialized (global)");
    }
    return global.prisma;
  }
}

// Initialize prisma *once* and store the promise
const prismaPromise = getPrismaClient();

module.exports = {
  getPrisma: async () => await prismaPromise, // Export a function to get prisma
};