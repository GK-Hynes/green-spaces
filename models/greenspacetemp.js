const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

// Set Cloudinary transforms on image thumbnails
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// Make sure virtuals are kept if Green Space is stringified
const opts = { toJSON: { virtuals: true } };

const GreenspaceSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
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
  },
  opts
);

// Generate content for Green Space cluster map popup
GreenspaceSchema.virtual("properties.popupMarkup").get(function () {
  return `<strong><a href="/greenspaces/${this._id}">${this.title}</a></strong>`;
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
