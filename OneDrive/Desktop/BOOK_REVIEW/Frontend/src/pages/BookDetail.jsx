import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard";
import { motion } from "framer-motion";
const API = import.meta.env.VITE_API_URL;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
    fetchBookReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`${API}/api/books/${id}`);
      setBook(res.data.book);
      fetchRelatedBooks(res.data.book.genre, res.data.book._id);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookReviews = async () => {
    try {
      const res = await axios.get(`${API}/api/reviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchRelatedBooks = async (genre, currentId) => {
    try {
      const res = await axios.get(`${API}/api/books`, {
        params: { genre },
      });
      const filtered = res.data.books.filter((b) => b._id !== currentId);
      setRelatedBooks(filtered.slice(0, 4));
    } catch (error) {
      console.error("Error fetching related books:", error);
    }
  };

  if (loading) return <p className="text-center py-8">Loading book details...</p>;
  if (!book) return <p className="text-center py-8">Book not found.</p>;

  return (
    <motion.div
      className="min-h-screen w-full bg-red-100 px-4 py-6 md:px-10 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.img
          src={book.coverImage}
          alt={book.title}
          className="w-full md:w-1/3 object-cover rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        />

        <div className="flex-1">
          <motion.h2
            className="text-3xl text-black font-bold mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {book.title}
          </motion.h2>
          <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
          <p className="text-gray-700 mb-1"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-gray-700 mb-1"><strong>Published Year:</strong> {book.publishedYear}</p>
          <p className="text-gray-700 mb-1"><strong>Language:</strong> {book.language}</p>
          <p className="text-gray-700 mb-1"><strong>Pages:</strong> {book.pages}</p>
          <p className="text-yellow-600 font-semibold">
            ⭐ {book.rating?.toFixed(1) || "No rating yet"}
          </p>
          <p className="mt-4 text-gray-800">{book.description}</p>

          <div className="flex gap-4 mt-6">
            <motion.button
              onClick={() => navigate(`${API}/books/${id}/review`, { state: { book } })}
              className="bg-transparent text-black px-5 py-2 rounded border-none focus:outline-none "
              whileHover={{ scale: 1.05 }}
            >
              ➕ Add Your Review
            </motion.button>

            <motion.button
              className="bg-transparent text-black border-none focus:outline-none px-5 py-2 "
              whileHover={{ scale: 1.05 }}
              onClick={() => alert("Download started (dummy)")}
            >
              ⬇️ Download Book
            </motion.button>

            <motion.button
              className=" px-5 py-2 bg-transparent text-black border-none focus:outline-none"
              whileHover={{ scale: 1.05 }}
              onClick={() => alert("Book added to favorites (dummy)")}
            >
              📌 Bookmark
            </motion.button>
          </div>
        </div>
      </motion.div>

      
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl text-red-800 font-semibold mb-4">📢 Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
  <motion.div
    key={idx}
    className="bg-white p-4 rounded-md shadow-sm"
    whileHover={{ scale: 1.02 }}
  >
    <p className="text-sm text-gray-600">👤 {review.user?.name || "Anonymous"}</p>
    <p className="text-yellow-500 text-sm mb-1">⭐ {review.rating}/5</p>
    <p className="text-black text-sm">{review.comment}</p>
    <p className="text-xs text-gray-500 mt-1">
      {new Date(review.createdAt).toLocaleString()}
    </p>
  </motion.div>
))}

          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </motion.div>

      
      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-red-800">📚 Related Books</h3>
        {relatedBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedBooks.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookCard book={b} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related books found.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BookDetail;



