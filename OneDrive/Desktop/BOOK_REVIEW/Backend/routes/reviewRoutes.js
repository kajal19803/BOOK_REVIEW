const express = require ("express");
const router = express.Router();
const { getReviewsByBook,submitReview,} = require("../controllers/reviewController");
router.get("/:id", getReviewsByBook); 
router.post("/", submitReview);   

module.exports = router;

