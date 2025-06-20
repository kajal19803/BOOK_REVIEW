import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { motion, AnimatePresence } from "framer-motion";
const API = import.meta.env.VITE_API_URL;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPages, setSelectedPages] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFeatured, setSelectedFeatured] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // State to toggle mobile filter panel
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setAllGenres([
      "All",
      "Finance",
      "Fiction",
      "Non-Fiction",
      "Romance",
      "Science",
      "Fantasy",
      "Mystery",
      "Biography",
    ]);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [
    searchQuery,
    selectedGenre,
    selectedRating,
    selectedLanguage,
    selectedPages,
    selectedYear,
    selectedFeatured,
    currentPage,
  ]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/books`, {
        params: {
          search: searchQuery,
          genre: selectedGenre,
          rating: selectedRating,
          language: selectedLanguage,
          pages: selectedPages,
          publishedYear: selectedYear,
          featured: selectedFeatured,
          page: currentPage,
          limit: limit,
        },
      });
      setBooks(res.data.books || []);
      setTotalPages(Math.ceil(res.data.totalCount / limit));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedRating("");
    setSelectedLanguage("");
    setSelectedPages("");
    setSelectedYear("");
    setSelectedFeatured("");
    setCurrentPage(1);
  };

  return (
    <motion.div
      className="min-h-screen w-full px-4 py-6 sm:px-10 bg-gradient-to-br from-blue-50 to-purple-100 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📚 Browse Books
      </h2>

      {/* Mobile filter toggle bar */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters((v) => !v)}
          className="w-full border border-gray-300 rounded-md py-2 text-center text-gray-600 bg-white hover:bg-gray-100 transition"
        >
          {showMobileFilters ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar - visible on lg+, or toggled on mobile */}
        <AnimatePresence>
          {(showMobileFilters || window.innerWidth >= 1024) && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full lg:w-64 bg-red-100 rounded-lg shadow-md p-4 space-y-4 overflow-hidden"
              style={{ display: window.innerWidth >= 1024 ? "block" : undefined }}
            >
              <h3 className="text-xl font-semibold mb-2 text-black">📂 Filters</h3>

              <input
                type="text"
                placeholder="🔍 Search title or author"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
              />

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) =>
                    setSelectedGenre(e.target.value === "All" ? "" : e.target.value)
                  }
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
                >
                  {allGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Pages (min)
                </label>
                <input
                  type="number"
                  value={selectedPages}
                  onChange={(e) => setSelectedPages(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
                  placeholder="e.g. 200"
                />
              </div>

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Published Year
                </label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md text-sm"
                  placeholder="e.g. 2020"
                />
              </div>

              <div>
                <label className="block text-sm text-black font-medium mb-1">
                  Featured
                </label>
                <select
                  value={selectedFeatured}
                  onChange={(e) => setSelectedFeatured(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Not Selected</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <button
                onClick={fetchBooks}
                className="w-full bg-transparent text-black py-2 rounded text-sm"
              >
                🔍 Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 text-sm"
              >
                🔁 Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Books grid */}
        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-500">⏳ Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500">📍 No books found.</p>
          ) : (
            <>
              <motion.div
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
              >
                {books.map((book) => (
                  <motion.div
                    key={book._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : " text-black bg-transparent"
                  }`}
                >
                  ⬅ Prev
                </button>
                <span className="text-gray-800 font-semibold pt-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-transparent text-black "
                  }`}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookList;
