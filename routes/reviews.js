const express = require("express");
const Greenspace = require("../models/greenspace");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    greenspace.reviews.push(review);
    await review.save();
    await greenspace.save();
    req.flash("success", "Created new review");
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Greenspace.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/greenspaces/${id}`);
  })
);

module.exports = router;
