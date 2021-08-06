const express = require("express");
const Greenspace = require("../models/greenspace");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id);
    const review = new Review(req.body.review);
    greenspace.reviews.push(review);
    await review.save();
    await greenspace.save();
    req.flash("success", "Created new review");
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

router.delete(
  "/:reviewId",
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
