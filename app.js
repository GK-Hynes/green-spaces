const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();
const Greenspace = require("./models/greenspace");
const connectDB = require("./db");

// Connect to database
connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
