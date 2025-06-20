# 📚 Book Review System – React + Vite + Express  + MongoDB

A full-stack book review platform where users can explore books, submit reviews, and read feedback from others. Built using **React + Vite**, **Node.js + Express**, and **MongoDB**.

---
## 🧱 Tech Stack
- **Frontend**: React (with Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT-based (stored in `localStorage`)
---
## 🚀 Features

- 📘 View book details with title, author, genre, etc.
- ✍️ Submit a review with rating and comment (authenticated users only)
- 📊 Automatically calculate and display average rating
- ✅ Real-time review list update after submission
- 🔒 Review access restricted to logged-in users
- 💡 Clean UI with Tailwind CSS
---
## 📁 Folder Structure

project-BOOK_REVIEW/
├── Frontend/ # React Frontend
│ ├── components/
│ │ └── AddBookModal.jsx
│ │ └── BookCard.jsx
│ │ └── Footer.jsx
│ │ └── Navbar.jsx
│ ├── pages/
│ │ └── AdminDashboard.jsx
│ │ └── BookDetail.jsx
│ │ └── BookList.jsx
│ │ └── Home.jsx
│ │ └── ReviewForm.jsx
│ │ └── UserProfile.jsx
│ ├── App.jsx
│ └── main.jsx
│
├── server/ # Express Backend
│ ├── models/
│ │ └── Book.js
│ │ └── Review.js
│ │ └── User.js
│ ├── routes/
│ │ └── bookRoutes.js
│ │ └── reviewRoutes.js
│ │ └── userRoutes.js
│ ├── controllers/
│ │ └── bookController.js
│ │ └── reviewController.js
│ │ └── userController.js
│ └── server.js
---
## 🌐 API Routes
---
### 📘 Book Routes (`/api/books`)

| Method   | Endpoint           | Access         | Description                            |
|----------|--------------------|----------------|----------------------------------------|
| `GET`    | `/api/books`       | Public         | Fetch all books                        |
| `GET`    | `/api/books/:id`   | Public         | Fetch a single book by ID              |
| `POST`   | `/api/books`       | Admin only     | Add a new book                         |
| `DELETE` | `/api/books/:id`   | Admin only     | Delete a book by ID                    |

---

### ✍️ Review Routes (`/api/reviews`)

| Method   | Endpoint             | Access         | Description                             |
|----------|----------------------|----------------|-----------------------------------------|
| `GET`    | `/api/reviews/:id`   | Public         | Get all reviews for a specific book     |
| `POST`   | `/api/reviews`       | Logged-in user | Submit a new review for a book          |

---

### 👤 User Routes (`/api/users`)

| Method   | Endpoint              | Access         | Description                                 |
|----------|-----------------------|----------------|---------------------------------------------|
| `POST`   | `/api/users/register` | Public         | Register a new user                         |
| `POST`   | `/api/users/verify-otp` | Public       | Verify OTP after registration               |
| `POST`   | `/api/users/login`    | Public         | Login an existing user                      |
| `GET`    | `/api/users/:id`      | Logged-in user | Get user profile by ID                      |
| `PUT`    | `/api/users/:id`      | Logged-in user | Update user profile (name, email, etc.)     |


---
## 🧠 Data Flow

```text
Book → ReviewForm.jsx
 ↳ User selects rating & comment
 ↳ Submit → POST /api/reviews
 ↳ On success → fetch latest reviews → display average + list
🔐 Authentication
JWT token stored in localStorage (userToken)

Token is sent via Authorization: Bearer <token> in Axios headers

Only logged-in users can submit reviews

📄 Backend: Review Model
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model("Review", reviewSchema);

🎨 Frontend: Review Form Example
<form onSubmit={handleSubmit}>
  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
    {[5, 4, 3, 2, 1].map((r) => (
      <option key={r} value={r}>{r}</option>
    ))}
  </select>
  <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
  
  <button type="submit">Submit Review</button>
</form>

To Do
 Prevent duplicate reviews by same user

 Allow editing/deleting own review

 Paginate long review lists

 Show reviews summary in book listing

📦 Installation & Setup
1. Backend

cd server
npm install
npm run dev

2. Frontend

cd client
npm install
npm run dev

📊 Sample Review Document

{
  "_id": "64b1...",
  "book": "6491b...",
  "user": {
    "_id": "6478...",
    "name": "Kajal Verma"
  },
  "rating": 5,
  "comment": "Very informative.",
  "createdAt": "2025-06-19T12:00:00.000Z"
}

🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

🧡 Author
Kajal Verma
NIAMT Ranchi · BOOK_REVIEW Project · MERN Developer
--
