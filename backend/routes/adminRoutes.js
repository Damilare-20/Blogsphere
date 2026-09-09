const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleUserStatus,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  getPlatformStats,
  getCreatorStats,
} = require("../controller/adminController");

const { protect, authorize } = require("../middleware/auth");

router.get("/stats", protect, authorize("admin"), getPlatformStats);
router.get("/stats/creator/:userId", protect, getCreatorStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.patch("/users/:id/toggle-status", protect, authorize("admin"), toggleUserStatus);
router.get("/articles/pending", protect, authorize("admin"), getPendingArticles);
router.patch("/articles/:id/approve", protect, authorize("admin"), approveArticle);
router.patch("/articles/:id/reject", protect, authorize("admin"), rejectArticle);

module.exports = router;