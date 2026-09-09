const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
  getPendingArticles,
  submitForReview,
  deleteArticle,
  toggleLike,
  toggleBookmark,
  getBookmarkedArticles,
} = require("../controller/articleController");

const { addComment, getCommentsForArticle } = require("../controller/commentController");

const { protect, authorize, optionalAuth } = require("../middleware/auth");

router.post("/", protect, authorize("creator", "admin"), createArticle);
router.get("/", optionalAuth, getAllArticles);
router.get("/my", protect, authorize("creator", "admin"), getMyArticles);
router.patch("/:id/submit", protect, authorize("creator"), submitForReview);
router.get("/pending", protect, authorize("admin"), getPendingArticles);
router.get("/bookmarks", protect, getBookmarkedArticles);

router.post(
  "/upload-image",
  protect,
  authorize("creator", "admin"),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    res.status(200).json({ url: req.file.path });
  }
);

router.patch("/:id/like", protect, toggleLike);
router.patch("/:id/bookmark", protect, toggleBookmark);

router.put("/:id", protect, authorize("creator", "admin"), updateArticle);
router.delete("/:id", protect, authorize("creator", "admin"), deleteArticle);
router.get("/:id", optionalAuth, getArticleById);

router.post("/:articleId/comments", protect, addComment);
router.get("/:articleId/comments", getCommentsForArticle);

module.exports = router;