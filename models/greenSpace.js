const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const GreenspaceSchema = new Schema({
  title: String,
  image: String,
  fee: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

// After you delete a Green Space, delete all associated reviews
GreenspaceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
});

module.exports = mongoose.model("Greenspace", GreenspaceSchema);
