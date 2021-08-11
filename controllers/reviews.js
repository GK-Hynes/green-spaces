const Greenspace = require("../models/greenspace");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const greenspace = await Greenspace.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  greenspace.reviews.push(review);
  await review.save();
  await greenspace.save();
  req.flash("success", "Created new review");
  res.redirect(`/greenspaces/${greenspace._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Greenspace.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/greenspaces/${id}`);
};
