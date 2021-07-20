const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GreenSpaceSchema = new Schema({
  title: String,
  fee: String,
  description: String,
  location: String
});

module.exports = mongoose.model("GreenSpace", GreenSpaceSchema);
