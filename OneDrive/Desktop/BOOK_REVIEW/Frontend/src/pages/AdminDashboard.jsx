import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";
const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allGenres, setAllGenres] = useState([]);

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

  const fetchBooks = async () => {
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
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    try {
      await axios.delete(`${API}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks(); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleBookAdded = () => {
    setShowModal(false);
    fetchBooks(); 
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

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedGenre, selectedRating, selectedLanguage, selectedPages, selectedYear, selectedFeatured, currentPage]);

  return (
    <div className="px-6 py-8 bg-gray-100 min-h-screen w-full pt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">📚 Admin Book Manager</h2>
        <button
          className="bg-white text-black border border-green-600 px-4 py-2 rounded hover:bg-green-100"
          onClick={() => setShowModal(true)}
        >
          ➕ Add New Book
        </button>
      </div>

      
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <input
          type="text"
          placeholder="🔍 Search title or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 text-black bg-white rounded text-sm"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value === "All" ? "" : e.target.value)}
          className="border px-3 text-black bg-white  py-2 rounded text-sm"
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="border text-black bg-white px-3 py-2 rounded text-sm"
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border text-black bg-white px-3 py-2 rounded text-sm"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
        </select>

        <input
          type="number"
          placeholder="Min Pages"
          value={selectedPages}
          onChange={(e) => setSelectedPages(e.target.value)}
          className="border text-black bg-white px-3 py-2 rounded text-sm"
        />

        <input
          type="number"
          placeholder="Published Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border text-black bg-white px-3 py-2 rounded text-sm"
        />

        <select
          value={selectedFeatured}
          onChange={(e) => setSelectedFeatured(e.target.value)}
          className="border text-black bg-white px-3 py-2 rounded text-sm"
        >
          <option value="">Featured?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={fetchBooks}
            className="text-black bg-white  px-3 py-2 rounded text-sm"
          >
            🔍 Apply
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-300 text-black px-3 py-2 rounded text-sm"
          >
            🔁 Reset
          </button>
        </div>
      </div>

      
      {books.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} onDelete={handleDelete} isAdmin />
            ))}
          </div>

          
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next ➡
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No books found.</p>
      )}

     
      {showModal && (
        <AddBookModal
          onClose={() => setShowModal(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;


