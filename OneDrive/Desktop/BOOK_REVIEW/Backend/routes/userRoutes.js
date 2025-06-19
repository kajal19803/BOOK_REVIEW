const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { registerUser,verifyUserOtp,loginUser,getUserProfile,updateUserProfile,} = require("../controllers/userController");
router.post("/register", registerUser);
router.post("/verify-otp", verifyUserOtp);
router.post("/login", loginUser);
router.get("/:id", authMiddleware, getUserProfile);
router.put("/:id", authMiddleware, updateUserProfile);

module.exports = router;

