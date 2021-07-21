const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GreenspaceSchema = new Schema({
  title: String,
  fee: String,
  description: String,
  location: String
});

module.exports = mongoose.model("Greenspace", GreenspaceSchema);
