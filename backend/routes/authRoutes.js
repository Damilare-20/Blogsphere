const express = require("express");
const router = express.Router();

const {
	registerUser,
	loginUser,
	getProfile,
	updateProfile,
} = require("../controller/authController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);

module.exports = router;