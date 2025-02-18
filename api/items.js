const express = require("express");
const router = express.Router();

const { prisma } = require("../db/common");

const { isLoggedIn } = require("./auth");

// Get all items
router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.items.findMany();
    res.send(items);
  } catch (error) {
    next(error);
  }
});

// Get individual item
router.get("/:id", async (req, res, next) => {
  try {
    const items = await prisma.items.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
        include: { reviews: true },
      },
    });
    res.send(items);
  } catch (error) {
    next(error);
  }
});

// Get individual item reviews
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        itemId: parseInt(req.params.id),
        review: req.body.review,
      },
      include: { user: true },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

// Get individual review
router.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await prisma.reviews.findFirst({
      where: {
        id: parseInt(req.params.id),
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
    const reviews = await prisma.reviews.create({
      data: {
        user: { connect: { id: parseInt(req.user.id) } },
        item: { connect: { id: parseInt(req.params.id) } },
        review: req.body.review,
        rating: parseInt(req.body.rating),
      },
    });

    res.status(201).send(reviews);
  } catch (error) {
    next(error);
  }
});

// Create a comment on review

router.post(
  "/:id/reviews/:reviewId/comments",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const comments = await prisma.comments.create({
        data: {
          user: { connect: { id: parseInt(req.user.id) } },
          review: { connect: { id: parseInt(req.params.id) } },
          comment: req.body.comment,
        },
      });
      res.status(201).send(comments);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
