const express = require("express");
const router = express.Router();
const { getAllBooks, getBookById, addBook, deleteBook } = require("../controllers/bookController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", authMiddleware, adminMiddleware, addBook);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook); 

module.exports = router;


