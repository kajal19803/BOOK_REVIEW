import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();

  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

 const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API}/api/users/login`, {
      email: formData.email,
      password: formData.password,
    });

    const token = res.data.token;
    localStorage.setItem("userToken", token);
    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
    setUser(res.data.user);
    setIsLoggedIn(true);
    setShowModal(false);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");

    
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

   
    if (res.data.user.isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};




  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${API}/api/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setOtpSent(true);
      setRegisteredEmail(formData.email);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const verifyOtpHandler = async () => {
    try {
      await axios.post(`${API}/api/users/verify-otp`, {
        email: registeredEmail,
        otp: enteredOtp,
      });
      alert("Email verified! You can now log in.");
      setOtpSent(false);
      setShowModal(false);
      setActiveTab("login");
      setEnteredOtp("");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <nav className="bg-purple-50 fixed top-0 w-full shadow-md px-4 md:px-10 py-4 flex justify-between items-center z-50">
        <Link to="/" className="text-2xl font-serif-bold text-purple-600">📚 BookVerse</Link>
        <div className="flex gap-6 items-center text-lg md:text-base">
          <Link to="/" className="hover:text-black font-medium">Home</Link>
          <Link to="/books" className="hover:text-black font-medium">Browse</Link>

         {isLoggedIn && user ? (
            <>
              <Link
                 to={user.isAdmin ? "/admin/dashboard" : `${API}/users/${user._id}`}
                 className="hover:text-blue-600 font-medium"
              >
              My Profile
             </Link>
             <button
              onClick={handleLogout}
              className="bg-transparent text-red-800 px-3 py-1 rounded  text-lg"
             >
              Logout
             </button>
             </>
             ) : (
             <button
              onClick={() => setShowModal(true)}
             className="bg-transparent text-black px-4 py-1.5 rounded "
             >
                Login / Register
            </button>
          )}

        </div>
      </nav>

     
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => {
                setShowModal(false);
                setOtpSent(false);
                setEnteredOtp("");
                setError("");
              }}
              className="absolute top-5 right-5 text-red-600 hover:text-red-800 text-lg leading-none p-0 m-0 bg-transparent border-none outline-none"
            >
              ✖
            </button>

           
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                  setOtpSent(false);
                }}
                className={`px-4 py-2 font-semibold leading-none p-0 m-0 bg-transparent border-none focus:outline-none ${activeTab === "login"
                  ? "text-blue-600  bg-white leading-none p-0 m-0 bg-transparent border-none focus:outline-none"
                  : "text-gray-600 bg-white leading-none p-0 m-0 bg-transparent border-none focus:outline-none"

                  }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setError("");
                  setOtpSent(false);
                }}
                className={`px-4 py-2 font-semibold leading-none p-0 m-0 bg-transparent border-none focus:outline-none ${activeTab === "register"
                  ? "text-blue-600 bg-white  leading-none p-0 m-0 bg-transparent border-none focus:outline-none"
                  : "text-gray-600 bg-white leading-none p-0 m-0 bg-transparent border-none focus:outline-none"
                  }`}
              >
                Register
              </button>
            </div>

           
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            )}

           
            {activeTab === "register" && !otpSent && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  className="w-full border  text-gray-700 bg-white rounded px-3 py-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  onChange={handleChange}
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                  Send OTP
                </button>
              </form>
            )}

           
            {otpSent && (
              <div className="space-y-3">
                <p className="text-gray-700 text-sm">
                  Enter the OTP sent to <strong>{registeredEmail}</strong>
                </p>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full text-gray-700 bg-white border px-3 py-2 rounded"
                />
                <button
                  onClick={verifyOtpHandler}
                  className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;







