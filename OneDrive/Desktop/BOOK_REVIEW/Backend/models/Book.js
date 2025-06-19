const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    genre: String,
    rating: Number,
    publishedYear: Number,
    coverImage: String,
    language: String,
    pages: Number,
    description: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

