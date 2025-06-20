import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const MobileNavbar = ({
  user,
  isLoggedIn,
  handleLogout,
  showModal,
  setShowModal,
  menuOpen,
  setMenuOpen,
  setActiveTab,
  handleChange,
  formData,
  activeTab,
  error,
  otpSent,
  setOtpSent,
  enteredOtp,
  setEnteredOtp,
  registeredEmail,
  verifyOtpHandler,
  handleLoginSubmit,
  handleRegisterSubmit,
}) => {
  return (
    <nav className="bg-purple-50 fixed top-0 w-full shadow-md px-4 py-4 flex justify-between items-center z-50 md:hidden">
      <Link to="/" className="text-2xl font-serif-bold text-purple-600">
        📚 BookVerse
      </Link>

      <button
        className="text-purple-600 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 leading-none p-0 m-0 bg-transparent border-none focus:outline-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {!isLoggedIn && !menuOpen && (
        <button
          onClick={() => setShowModal(true)}
          className="text-black px-4 py-1.5 rounded leading-none bg-transparent border-none focus:outline-none"
        >
          Login / Register
        </button>
      )}

      <div
        className={`flex flex-col gap-6 text-lg absolute top-full left-0 w-full bg-purple-50 px-4 py-4 shadow-md transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-[120%]"
        }`}
        style={{ zIndex: 999 }}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="hover:text-black font-medium"
        >
          Home
        </Link>
        <Link
          to="/books"
          onClick={() => setMenuOpen(false)}
          className="hover:text-black font-medium"
        >
          Browse
        </Link>

        {isLoggedIn && user ? (
          <>
            <Link
              to={user.isAdmin ? "/admin/dashboard" : `/users/${user._id}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 font-medium"
            >
              My Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-800 px-3 py-1 rounded text-lg bg-transparent border-none focus:outline-none"
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

const DesktopNavbar = ({
  user,
  isLoggedIn,
  handleLogout,
  setShowModal,
  setActiveTab,
  handleChange,
  formData,
  activeTab,
  error,
  otpSent,
  setOtpSent,
  enteredOtp,
  setEnteredOtp,
  registeredEmail,
  verifyOtpHandler,
  handleLoginSubmit,
  handleRegisterSubmit,
}) => {
  return (
    <nav className="bg-purple-50 fixed top-0 w-full shadow-md px-10 py-4 flex justify-between items-center z-50 hidden md:flex">
      <Link to="/" className="text-2xl font-serif-bold text-purple-600">
        📚 BookVerse
      </Link>

      <div className="flex gap-6 text-base items-center">
        <Link to="/" className="hover:text-black font-medium">
          Home
        </Link>
        <Link to="/books" className="hover:text-black font-medium">
          Browse
        </Link>

        {isLoggedIn && user ? (
          <>
            <Link
              to={user.isAdmin ? "/admin/dashboard" : `/users/${user._id}`}
              className="hover:text-blue-600 font-medium"
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-800 px-3 py-1 rounded text-lg bg-transparent border-none focus:outline-none"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setShowModal(true);
              setActiveTab("login");
            }}
            className="text-black px-4 py-1.5 rounded leading-none bg-transparent border-none focus:outline-none"
          >
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};

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
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
    setMenuOpen(false);
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

      setMenuOpen(false);
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
      <MobileNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        showModal={showModal}
        setShowModal={setShowModal}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setActiveTab={setActiveTab}
        handleChange={handleChange}
        formData={formData}
        activeTab={activeTab}
        error={error}
        otpSent={otpSent}
        setOtpSent={setOtpSent}
        enteredOtp={enteredOtp}
        setEnteredOtp={setEnteredOtp}
        registeredEmail={registeredEmail}
        verifyOtpHandler={verifyOtpHandler}
        handleLoginSubmit={handleLoginSubmit}
        handleRegisterSubmit={handleRegisterSubmit}
      />

      <DesktopNavbar
        user={user}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        setShowModal={setShowModal}
        setActiveTab={setActiveTab}
        handleChange={handleChange}
        formData={formData}
        activeTab={activeTab}
        error={error}
        otpSent={otpSent}
        setOtpSent={setOtpSent}
        enteredOtp={enteredOtp}
        setEnteredOtp={setEnteredOtp}
        registeredEmail={registeredEmail}
        verifyOtpHandler={verifyOtpHandler}
        handleLoginSubmit={handleLoginSubmit}
        handleRegisterSubmit={handleRegisterSubmit}
      />

     
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
                className={`px-4 py-2 font-semibold leading-none p-0 m-0 bg-transparent border-none focus:outline-none ${
                  activeTab === "login" ? "text-blue-600" : "text-gray-600"
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
                className={`px-4 py-2 font-semibold leading-none p-0 m-0 bg-transparent border-none focus:outline-none ${
                  activeTab === "register" ? "text-blue-600" : "text-gray-600"
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
                  className="w-full border text-gray-700 bg-white rounded px-3 py-2"
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


