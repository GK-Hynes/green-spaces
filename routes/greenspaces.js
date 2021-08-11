const express = require("express");
const Greenspace = require("../models/greenspace");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateGreenspace } = require("../middleware");

const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const greenspaces = await Greenspace.find({});
    res.render("greenspaces/index", { greenspaces });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("greenspaces/new");
});

router.post(
  "/",
  isLoggedIn,
  validateGreenspace,
  catchAsync(async (req, res, next) => {
    const greenspace = new Greenspace(req.body.greenspace);
    greenspace.author = req.user._id;
    await greenspace.save();
    req.flash("success", "Successfully made a new Green Space");
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("author");
    if (!greenspace) {
      req.flash("error", "Cannot find that Green Space");
      return res.redirect("/greenspaces");
    }
    res.render("greenspaces/show", { greenspace });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const greenspace = await Greenspace.findById(id);
    if (!greenspace) {
      req.flash("error", "Cannot find that Green Space");
      return res.redirect("/greenspaces");
    }
    res.render("greenspaces/edit", { greenspace });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateGreenspace,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const greenspace = await Greenspace.findByIdAndUpdate(id, {
      ...req.body.greenspace
    });
    req.flash("success", "Successfully updated Green Space");
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Greenspace.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Green Space");
    res.redirect("/greenspaces");
  })
);

module.exports = router;
