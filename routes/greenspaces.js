const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateGreenspace } = require("../middleware");
const greenspaces = require("../controllers/greenspaces");

const router = express.Router();

router.get("/", catchAsync(greenspaces.index));

router.get("/new", isLoggedIn, greenspaces.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateGreenspace,
  catchAsync(greenspaces.createGreenspace)
);

router.get("/:id", catchAsync(greenspaces.showGreenspace));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(greenspaces.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateGreenspace,
  catchAsync(greenspaces.updateGreenspace)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(greenspaces.deleteGreenspace)
);

module.exports = router;
