
const express = require("express");
const router = express.Router();
require("dotenv").config();

const { prisma } = require("../db/common");
const { isLoggedIn } = require("./auth"); 

// Get comments made by user
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        userId: parseInt(req.user.id),
        comment: req.body.comment,
      },
    });
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// Update user review

router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const comments = await prisma.comments.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        comment: req.body.comment,
      },
    });
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

// Delete user comment

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const comments = await prisma.comments.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
