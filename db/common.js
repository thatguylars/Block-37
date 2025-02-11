const { PrismaClient } = require("@prisma/client");

let prisma; // Important: declare prisma outside the conditional

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = { prisma };
