const mongoose = require("mongoose");
const Book = require ("./models/Book");
require("dotenv").config();

const books = [
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller",
    rating: 4.4,
    publishedYear: 2019,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    language: "English",
    pages: 336,
    description: "A gripping thriller about a woman's act of violence and the therapist uncovering her motive.",
    featured: true,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    rating: 4.8,
    publishedYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    language: "English",
    pages: 320,
    description: "A practical guide to building good habits and breaking bad ones.",
    featured: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    rating: 4.6,
    publishedYear: 1949,
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    language: "English",
    pages: 328,
    description: "A dystopian novel depicting a totalitarian regime with constant surveillance.",
    featured: false,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    rating: 4.3,
    publishedYear: 1988,
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136",
    language: "English",
    pages: 208,
    description: "A mystical story of a shepherd boy's journey to realize his personal legend.",
    featured: true,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    rating: 4.7,
    publishedYear: 2011,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    language: "English",
    pages: 464,
    description: "A brief history of humankind from the Stone Age to the modern day.",
    featured: false,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    rating: 4.9,
    publishedYear: 1960,
    coverImage: "https://images.unsplash.com/photo-1544935207-cdbc2dd60fa2",
    language: "English",
    pages: 281,
    description: "A novel on racial injustice and childhood innocence in the Deep South.",
    featured: true,
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    genre: "Spirituality",
    rating: 4.5,
    publishedYear: 1997,
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    language: "English",
    pages: 236,
    description: "A guide to spiritual enlightenment and living in the present moment.",
    featured: false,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    genre: "Finance",
    rating: 4.4,
    publishedYear: 1997,
    coverImage: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
    language: "English",
    pages: 207,
    description: "What the rich teach their kids about money that the poor and middle class do not.",
    featured: false,
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    genre: "Self-Help",
    rating: 4.2,
    publishedYear: 2016,
    coverImage: "https://images.unsplash.com/photo-1520975918310-52eeb3e0d8d4",
    language: "English",
    pages: 224,
    description: "A counterintuitive approach to living a good life.",
    featured: false,
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Historical Fiction",
    rating: 4.6,
    publishedYear: 2005,
    coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    language: "English",
    pages: 552,
    description: "A young girl finds solace in books during WWII in Nazi Germany.",
    featured: true,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    rating: 4.9,
    publishedYear: 1997,
    coverImage: "https://images.unsplash.com/photo-1589987601171-dc9b0db4a8d2",
    language: "English",
    pages: 309,
    description: "A young wizard discovers his magical heritage and destiny at Hogwarts.",
    featured: true,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    rating: 4.2,
    publishedYear: 1925,
    coverImage: "https://images.unsplash.com/photo-1528209392026-c4d892f7bc6b",
    language: "English",
    pages: 180,
    description: "A story of wealth, love, and the American Dream set in the 1920s.",
    featured: false,
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    genre: "Self-Help",
    rating: 4.3,
    publishedYear: 2016,
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    language: "English",
    pages: 208,
    description: "The Japanese secret to a long and happy life.",
    featured: false,
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    genre: "Motivational",
    rating: 4.5,
    publishedYear: 1937,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    language: "English",
    pages: 238,
    description: "A classic book on achieving success through personal beliefs and persistence.",
    featured: false,
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    genre: "Fiction",
    rating: 4.8,
    publishedYear: 2003,
    coverImage: "https://images.unsplash.com/photo-1553531384-cc64ac30f6a6",
    language: "English",
    pages: 371,
    description: "A heartbreaking story of friendship and redemption set in Afghanistan.",
    featured: true,
  }
];

module.exports = books;


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    await Book.deleteMany(); // Optional: clean old data
    await Book.insertMany(books);

    console.log("✅ Dummy books inserted successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });
