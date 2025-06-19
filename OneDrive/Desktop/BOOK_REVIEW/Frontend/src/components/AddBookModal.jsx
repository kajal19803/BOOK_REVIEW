import { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const AddBookModal = ({ onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    rating: "",
    publishedYear: "",
    coverImage: "",
    language: "",
    pages: "",
    description: "",
    featured: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(`${API}/api/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onBookAdded(res.data.book);
    } catch (err) {
      setError(err.response?.data?.message || "Add book failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-h-[90vh] overflow-y-auto rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-5 right-5 text-red-600 hover:text-red-800 text-lg leading-none p-0 m-0 bg-transparent border-none outline-none"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-600">Add New Book</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" required />
          <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" required />
          <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" required />
          <input type="number" name="rating" placeholder="Rating (0-5)" value={formData.rating} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" min="0" max="5" />
          <input type="number" name="publishedYear" placeholder="Published Year" value={formData.publishedYear} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" />
          <input type="text" name="coverImage" placeholder="Cover Image URL" value={formData.coverImage} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" />
          <input type="text" name="language" placeholder="Language" value={formData.language} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" />
          <input type="number" name="pages" placeholder="Pages" value={formData.pages} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border bg-white rounded px-3 py-2"></textarea>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            <label className="text-sm text-black">Featured Book</label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;

