const express = require("express");
const Greenspace = require("../models/greenspace");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { greenspaceSchema } = require("../schemas");

const router = express.Router();

const validateGreenspace = (req, res, next) => {
  const { error } = greenspaceSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const greenspaces = await Greenspace.find({});
    res.render("greenspaces/index", { greenspaces });
  })
);

router.get("/new", (req, res) => {
  res.render("greenspaces/new");
});

router.post(
  "/",
  validateGreenspace,
  catchAsync(async (req, res, next) => {
    const greenspace = new Greenspace(req.body.greenspace);
    await greenspace.save();
    req.flash("success", "Successfully made a new Green Space");
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id).populate(
      "reviews"
    );
    if (!greenspace) {
      req.flash("error", "Cannot find that Green Space");
      return res.redirect("/greenspaces");
    }
    res.render("greenspaces/show", { greenspace });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id);
    if (!greenspace) {
      req.flash("error", "Cannot find that Green Space");
      return res.redirect("/greenspaces");
    }
    res.render("greenspaces/edit", { greenspace });
  })
);

router.put(
  "/:id",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Greenspace.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Green Space");
    res.redirect("/greenspaces");
  })
);

module.exports = router;
