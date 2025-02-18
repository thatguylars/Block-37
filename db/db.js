const { prisma } = require("./common");
const bcrypt = require("bcrypt");


const createUser = async (username, password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};

const getUser = async (username) => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      username,
    },
  });
  return user;
};

const getUserId = async (id) => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      id: parseInt(id),
    },
  });
  return user;
};

module.exports = { createUser, getUser, getUserId };
