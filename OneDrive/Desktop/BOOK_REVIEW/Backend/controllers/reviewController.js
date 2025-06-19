const Review = require("../models/Review");

const getReviewsByBook = async (req, res) => {
  try {
    const book = req.params.id;
    
    if (!book) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const reviews = await Review.find({ book })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reviews", error });
  }
};




const submitReview = async (req, res) => {
  try {
    const { userId, book , rating, comment } = req.body;

    if (!userId || !book || !rating || !comment) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newReview = new Review({
      user: userId,
      book,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ success: true, message: "Review submitted", review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit review", error });
  }
};

module.exports = {
  getReviewsByBook,
  submitReview,
};

