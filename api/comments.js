
const express = require("express");
const router = express.Router();
require("dotenv").config();

const { prisma } = require("../db/common");
const { isLoggedIn } = require("./auth"); 

// Get comments made by user
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await prisma.comment.findMany({
      where: {
        userId: parseInt(req.user.id),
        comment: req.body.comment,
      },
    });
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

// Update user review

router.put("/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await prisma.comment.update({
      where: {
        id: parseInt(req.params.id),
        userId: parseInt(req.user.id),
      },
      data: {
        comment: req.body.comment,
      },
    });
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

// Delete user comment

router.delete("/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const comment = await prisma.Comment.delete({
      where: {
        id: parseInt(req.params.id),
        userId: parseInt(req.user.id),
      },
    });
    res.send(comment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
