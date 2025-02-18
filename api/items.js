const express = require("express");
const router = express.Router();

const { prisma } = require("../db/common");

const { isLoggedIn } = require("./auth");

// Get all items
router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.item.findMany();
    res.send(items);
  } catch (error) {
    next(error);
  }
});

// test

router.get("/test", async (req, res) => {
  try {
    console.log("Trying to connect to Prisma");
    const items = await prisma.item.findMany(); 
    console.log("Successfully fetched items:", items);
    res.send(items);
  } catch (error) {
    console.error("Prisma error:", error); // Log the full error!
    res.status(500).send("Error");
  }
});

// Get individual item
router.get("/:id", async (req, res, next) => {
  try {
    const items = await prisma.item.findFirstOrThrow({
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
    const reviews = await prisma.review.findMany({
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
    const review = await prisma.review.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.send(review);
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
      const comments = await prisma.comment.create({
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
