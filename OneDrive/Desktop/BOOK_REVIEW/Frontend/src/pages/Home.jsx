import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { Typewriter } from "react-simple-typewriter";
const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/books?featured=true&limit=6`)
      .then((res) => {
        setFeaturedBooks(res.data.books || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured books:", err);
        setLoading(false);
      });
  }, []);

  return (
    
    <div className="min-h-screen w-full bg-red-300 px-4 py-8 pt-20">
      
      <section className="bg-gradient-to-r from-yellow-100 to-yellow-300 p-8 rounded-2xl shadow-md text-center mb-12">
        <h1 className="text-4xl italic font-[custom] md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 font-poppins mb-3">
          Discover. Read. Review.
        </h1>
        <p className="text-gray-700 font-sans text-lg max-w-2xl mx-auto">
          Dive into a universe of books. Share your thoughts and explore what others are reading.
        </p>
      </section>

      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          📚 Featured Books
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading books...</p>
        ) : featuredBooks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No featured books found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      
      <section className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            <Typewriter
              words={['Have you read something amazing?']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            <Typewriter
              words={['Leave a review and help fellow readers find their next favorite book.']}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={2500}
            />
          </p>
        </div>
        <a
          href="/books"
          className="bg-pink-700 text-white px-6 py-2 rounded-lg hover:bg-yellow-300 hover:text-black transition font-semibold"
        >
          Browse All Books
        </a>
      </section>
    </div>
  );
};

export default Home;



