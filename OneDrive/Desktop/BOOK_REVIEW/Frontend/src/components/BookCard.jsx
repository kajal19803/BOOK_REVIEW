import { Link } from "react-router-dom";

const BookCard = ({ book, onDelete, isAdmin = false }) => {
  const isRecentlyAdded = () => {
    const createdDate = new Date(book.createdAt);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return createdDate > oneDayAgo;
  };

  return (
    <div className="relative group bg-white border rounded-lg p-2 sm:p-4 hover:shadow-lg transition">
      {isRecentlyAdded() && (
        <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-sm z-10 font-medium">
          🆕 Recently Added
        </div>
      )}

      <Link to={`/books/${book._id}`}>
        <img
          src={book.coverImage || "/default-book.png"}
          alt={book.title}
          className="w-full h-40 sm:h-48 object-cover rounded mb-3"
        />
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">by {book.author}</p>
        <div className="text-yellow-500 mt-1 text-sm sm:text-base">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>
              {i < Math.round(book.rating || 0) ? "★" : "☆"}
            </span>
          ))}
        </div>
      </Link>

      {isAdmin && (
        <button
          onClick={() => onDelete(book._id)}
          className="absolute top-2 right-2 text-red-600 bg-white border border-red-500 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm hover:bg-red-500 hover:text-white transition"
        >
          🗑 Delete
        </button>
      )}
    </div>
  );
};

export default BookCard;
