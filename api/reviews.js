const express = require("express");
const router = express.Router();

const { prisma } = require("../db/common");

const {isLoggedIn} = require("./auth");

// Get comments made by user
router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const review = await prisma.review.findMany({
      where: {
        userId: parseInt(req.user.id),
        ...(req.query.review && { content: { contains: req.query.review } }),
      },
    });
    res.send(review);
  } catch (error) {
    next(error);
  }
});
// Create a review
router.post("/:id/reviews", isLoggedIn, async (req, res, next) => {
  try {
    const review = await prisma.review.create({
      data: {
        user: { connect: { id: parseInt(req.user.id) } },
        item: { connect: { id: parseInt(req.params.id) } },
        review: req.body.review,
        rating: parseInt(req.body.rating),
      },
    });

    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
});
router.put("/:reviewId", isLoggedIn, async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: {
        id: parseInt(req.params.reviewId), // Use :reviewId
        userId: parseInt(req.user.id), // Add userId to where clause for security
      },
      data: {
        review: req.body.review,
        rating: parseInt(req.body.rating),
      },
    });
    res.send(review);
  } catch (error) {
    next(error);
  }
});

router.delete("/:reviewId", isLoggedIn, async (req, res, next) => {
  // :reviewId
  try {
    const review = await prisma.review.delete({
      where: {
        id: parseInt(req.params.reviewId), // Use :reviewId
        userId: parseInt(req.user.id), // Add userId to where clause for security
      },
    });
    res.status(204).send(review);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
