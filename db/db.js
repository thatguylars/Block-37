const { prisma } = require("./common");
const bcrypt = require("bcrypt");

const createUser = async (username, password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getUser = async (username) => {
  const response = await prisma.users.findFirstOrThrow({
    where: {
      username,
    },
  });
  return response;
};

const getUserId = async (id) => {
  const response = await prisma.users.findFirstOrThrow({
    where: {
      id,
    },
  });
  return response;
};

module.exports = { createUser, getUser, getUserId };
