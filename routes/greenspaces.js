const express = require("express");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateGreenspace } = require("../middleware");
const greenspaces = require("../controllers/greenspaces");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const router = express.Router();

router
  .route("/")
  .get(catchAsync(greenspaces.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateGreenspace,
    catchAsync(greenspaces.createGreenspace)
  );

router.get("/new", isLoggedIn, greenspaces.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(greenspaces.showGreenspace))
  .put(
    isLoggedIn,
    isAuthor,
    validateGreenspace,
    catchAsync(greenspaces.updateGreenspace)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(greenspaces.deleteGreenspace));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(greenspaces.renderEditForm)
);

module.exports = router;
