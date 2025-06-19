import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const ReviewForm = () => {
  const { id } = useParams(); 
  const { state } = useLocation();
  const book = state?.book;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${API}/api/reviews/${id}`);
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };

    if (id) fetchReviews();
  }, [id, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      await axios.post(
        `${API}/api/reviews`,
        {
          book: id,
          userId: userInfo._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Review submitted successfully!");
      setError("");
      setComment("");
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen w-screen px-4 py-6 md:px-10 bg-red-100 pt-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        ✍️ Submit Your Review
      </h2>

      {book && (
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full md:w-1/4 rounded shadow-md"
          />
          <div>
            <h3 className="text-xl text-black font-semibold">{book.title}</h3>
            <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
          <p className="text-gray-700 mb-1"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-gray-700 mb-1"><strong>Published Year:</strong> {book.publishedYear}</p>
          <p className="text-gray-700 mb-1"><strong>Language:</strong> {book.language}</p>
          <p className="text-gray-700 mb-1"><strong>Pages:</strong> {book.pages}</p>
          <p className="text-yellow-600 font-semibold">
            ⭐ {book.rating?.toFixed(1) || "No rating yet"}
          </p>
          </div>
        </div>
      )}

      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <label className="block text-sm  font-medium text-gray-700">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border bg-white text-black px-3 py-2 rounded focus:outline-none"
        >
            {[5, 4, 3, 2, 1].map((r) => {
            const labels = { 5: "Excellent 🌟",4: "Very Good 😊",3: "Good 🙂",2: "Fair 😐",1: "Poor 😞",};
        return (
           <option key={r} value={r}>
           {r} - {labels[r]}
           </option>
             );
         })}
       </select>


        <label className="block text-sm font-medium text-gray-700">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="5"
          required
          className="w-full border px-3 py-2 bg-white text-black rounded focus:outline-none"
          placeholder="Write your thoughts..."
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

     
      {reviews.length > 0 && (
        <div className="mt-10 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📚 Reviews:</h3>

          <div className="mb-4 text-sm text-gray-700">
            Average Rating:{" "}
            <span className="text-yellow-600 font-semibold">
              {averageRating} ⭐
            </span>{" "}
            ({reviews.length} review{reviews.length > 1 ? "s" : ""})
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="border text-black rounded p-4 shadow-sm bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-blue-700 font-semibold">
                    {rev.user?.name || "Anonymous"}
                  </p>
                  <span className="text-sm text-yellow-600">⭐ {rev.rating}</span>
                </div>
                <p className="text-black">{rev.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(rev.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
