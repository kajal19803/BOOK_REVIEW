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

  if (loading)
    return <p className="text-center py-8">Loading book details...</p>;
  if (!book) return <p className="text-center py-8">Book not found.</p>;

 
  const BookInfo = () => (
    <>
      <h2 className="text-black font-bold mb-2" style={{ fontSize: "2rem" }}>
        {book.title}
      </h2>
      <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
      <p className="text-gray-700 mb-1"><strong>Genre:</strong> {book.genre}</p>
      <p className="text-gray-700 mb-1"><strong>Published Year:</strong> {book.publishedYear}</p>
      <p className="text-gray-700 mb-1"><strong>Language:</strong> {book.language}</p>
      <p className="text-gray-700 mb-1"><strong>Pages:</strong> {book.pages}</p>
      <p className="text-yellow-600 font-semibold mb-4">⭐ {book.rating?.toFixed(1) || "No rating yet"}</p>
      <p className="text-gray-800">{book.description}</p>
    </>
  );

 
  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={() => navigate(`/books/${id}/review`, { state: { book } })}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
      >
        ➕ Add Your Review
      </button>
      <button
        onClick={() => alert("Download started (dummy)")}
        className="bg-gray-200 text-black py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
      >
        ⬇️ Download Book
      </button>
      <button
        onClick={() => alert("Book added to favorites (dummy)")}
        className="bg-gray-200 text-black py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
      >
        📌 Bookmark
      </button>
    </div>
  );

  
  const ReviewsSection = () => (
    <section className="mt-10">
      <h3 className="text-xl font-semibold text-red-800 mb-3">📢 Reviews</h3>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">👤 {review.user?.name || "Anonymous"}</p>
              <p className="text-yellow-500 text-sm mb-1">⭐ {review.rating}/5</p>
              <p className="text-black text-sm">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}
    </section>
  );

 
  const RelatedBooksSection = () => (
    <section className="mt-10">
      <h3 className="text-xl font-semibold text-red-800 mb-3">📚 Related Books</h3>
      {relatedBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedBooks.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No related books found.</p>
      )}
    </section>
  );

  
  const MobileView = () => (
    <motion.div
      className="block md:hidden min-h-screen w-full px-4 py-6 bg-red-100 pt-20 max-w-[90vw] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full rounded-lg shadow-md mb-4 object-cover"
      />

      <BookInfo />
      <ActionButtons />
      <ReviewsSection />
      <RelatedBooksSection />
    </motion.div>
  );

  
  const DesktopView = () => (
    <motion.div
      className="hidden md:block min-h-screen w-full px-10 py-6 bg-red-100 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-row gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.img
          src={book.coverImage}
          alt={book.title}
          className="w-1/3 object-cover rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        />
        <div className="flex-1 flex flex-col">
          <BookInfo />
          <ActionButtons />
        </div>
      </motion.div>

      <ReviewsSection />
      <RelatedBooksSection />
    </motion.div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
};

export default BookDetail;






