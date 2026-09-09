const express = require("express");
const router = express.Router();

const { deleteComment, getMyComments } = require("../controller/commentController");
const { protect } = require("../middleware/auth");

router.delete("/:id", protect, deleteComment);
router.get("/my", protect, getMyComments);

module.exports = router;