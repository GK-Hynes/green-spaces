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

app.get("/makegreenspace", async (req, res) => {
  const space = new GreenSpace({
    title: "St Stephen's Green",
    fee: "0",
    description: "You know the one"
  });
  await space.save();
  res.send(space);
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
