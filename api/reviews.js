const express = require("express");
const router = express.Router();

const { prisma } = require("../db/common");

const {isLoggedIn} = require("./auth");

// Get comments made by user
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        userId: parseInt(req.user.id),
        review: req.body.review,
      },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

//Update users review
router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        review: req.body.review,
        rating: parseInt(req.body.rating),
      },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

//Delete users review
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(204).send(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
