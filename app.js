require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const Greenspace = require("./models/greenspace");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/greenspaces", async (req, res) => {
  const greenspaces = await Greenspace.find({});
  res.render("greenspaces/index", { greenspaces });
});

app.get("/greenspaces/new", (req, res) => {
  res.render("greenspaces/new");
});

app.post("/greenspaces", async (req, res) => {
  const greenspace = new Greenspace(req.body.greenspace);
  await greenspace.save();
  res.redirect(`/greenspaces/${greenspace._id}`);
});

app.get("/greenspaces/:id", async (req, res) => {
  const greenspace = await Greenspace.findById(req.params.id);
  res.render("greenspaces/show", { greenspace });
});

app.get("/greenspaces/:id/edit", async (req, res) => {
  const greenspace = await Greenspace.findById(req.params.id);
  res.render("greenspaces/edit", { greenspace });
});

app.put("/greenspaces/:id", async (req, res) => {
  const { id } = req.params;
  const greenspace = await Greenspace.findByIdAndUpdate(id, {
    ...req.body.greenspace
  });
  res.redirect(`/greenspaces/${greenspace._id}`);
});

app.delete("/greenspaces/:id", async (req, res) => {
  const { id } = req.params;
  await Greenspace.findByIdAndDelete(id);
  res.redirect("/greenspaces");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
