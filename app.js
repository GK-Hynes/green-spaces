require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const Greenspace = require("./models/greenspace");
const Review = require("./models/review");
const { greenspaceSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

// Connect to database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB Connection Open");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateGreenspace = (req, res, next) => {
  const { error } = greenspaceSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Green Space Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/greenspaces",
  catchAsync(async (req, res) => {
    const greenspaces = await Greenspace.find({});
    res.render("greenspaces/index", { greenspaces });
  })
);

app.get("/greenspaces/new", (req, res) => {
  res.render("greenspaces/new");
});

app.post(
  "/greenspaces",
  validateGreenspace,
  catchAsync(async (req, res, next) => {
    const greenspace = new Greenspace(req.body.greenspace);
    await greenspace.save();
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

app.get(
  "/greenspaces/:id",
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id).populate(
      "reviews"
    );
    res.render("greenspaces/show", { greenspace });
  })
);

app.get(
  "/greenspaces/:id/edit",
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id);
    res.render("greenspaces/edit", { greenspace });
  })
);

app.put(
  "/greenspaces/:id",
  validateGreenspace,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const greenspace = await Greenspace.findByIdAndUpdate(id, {
      ...req.body.greenspace
    });
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

app.delete(
  "/greenspaces/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Greenspace.findByIdAndDelete(id);
    res.redirect("/greenspaces");
  })
);

// Review Routes
app.post(
  "/greenspaces/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const greenspace = await Greenspace.findById(req.params.id);
    const review = new Review(req.body.review);
    greenspace.reviews.push(review);
    await review.save();
    await greenspace.save();
    res.redirect(`/greenspaces/${greenspace._id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No, Something Went Wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
