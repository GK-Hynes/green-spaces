const { greenspaceSchema, reviewSchema } = require("./schemas");
const Greenspace = require("./models/greenspace");
const Review = require("./models/review");
const ExpressError = require("./utils/expressErrortemp");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateGreenspace = (req, res, next) => {
  const { error } = greenspaceSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const greenspace = await Greenspace.findById(id);
  if (!greenspace.author.equals(req.user._id)) {
    req.flash("error", "You do not permission to do that");
    return res.redirect(`/greenspaces/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not permission to do that");
    return res.redirect(`/greenspaces/${id}`);
  }
  next();
};
