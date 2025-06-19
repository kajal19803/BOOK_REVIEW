const Book = require("../models/Book");
const getAllBooks = async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
      ];
    }
   if (req.query.genre) {
      query.genre = req.query.genre;
    }
   if (req.query.language) {
      query.language = req.query.language;
    }
   if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }
    if (req.query.publishedFrom || req.query.publishedTo) {
      query.publishedYear = {};
      if (req.query.publishedFrom) {
        query.publishedYear.$gte = parseInt(req.query.publishedFrom);
      }
      if (req.query.publishedTo) {
        query.publishedYear.$lte = parseInt(req.query.publishedTo);
      }
    }
     if (req.query.minPages || req.query.maxPages) {
      query.pages = {};
      if (req.query.minPages) {
        query.pages.$gte = parseInt(req.query.minPages);
      }
      if (req.query.maxPages) {
        query.pages.$lte = parseInt(req.query.maxPages);
      }
    }
    if (req.query.featured === "true") {
      query.featured = true;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalCount: totalBooks,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error,
    });
  }
};
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ success: true, book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ success: false, message: "Error fetching book", error });
  }
};
const addBook = async (req, res) => {
  try {
    const { title,author,description,genre,featured,coverImage,rating,publishedYear,language,pages,} = req.body;
    if (!title || !author) {
      return res.status(400).json({ success: false, message: "Title and Author are required" });
    }
    const newBook = new Book({ title,author,description,genre,featured: featured || false,coverImage,rating,publishedYear,language,pages,});

    await newBook.save();
    res.status(201).json({ success: true, message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ success: false, message: "Error adding book", error });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ success: false, message: "Error deleting book", error });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook
};
