const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const GreenSpace = require("./models/greenSpace");
const connectDB = require("./db");

// Connect to database
connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/greenspaces", async (req, res) => {
  const greenSpaces = await GreenSpace.find({});
  res.render("greenspaces/index", { greenSpaces });
});

app.get("/greenspaces/:id", async (req, res) => {
  const greenSpace = await GreenSpace.findById(req.params.id);
  res.render("greenspaces/show", { greenSpace });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
