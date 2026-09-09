const User = require("../model/user");
const Article = require("../model/article");

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function toggleUserStatus(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: { id: user._id, name: user.name, isActive: user.isActive },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
async function getPendingArticles(req, res) {
  try {
    const articles = await Article.find({ status: "pending" })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function approveArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.status !== "pending") {
      return res.status(400).json({ message: "Only pending articles can be approved" });
    }

    article.status = "published";
    await article.save();

    res.status(200).json({ message: "Article approved and published", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function rejectArticle(req, res) {
  try {
    const { reason } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.status !== "pending") {
      return res.status(400).json({ message: "Only pending articles can be rejected" });
    }

    article.status = "draft";
    await article.save();

    res.status(200).json({
      message: "Article rejected and sent back to draft",
      reason: reason || "No reason provided",
      article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getPlatformStats(req, res) {
  try {
    const [users, articles, publishedArticles, pendingArticles] = await Promise.all([
      User.countDocuments(),
      Article.countDocuments(),
      Article.countDocuments({ status: "published" }),
      Article.countDocuments({ status: "pending" }),
    ]);

    res.status(200).json({ users, articles, publishedArticles, pendingArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getCreatorStats(req, res) {
  try {
    const creatorId = req.params.userId;
    const [articles, publishedArticles, pendingArticles, draftArticles] = await Promise.all([
      Article.countDocuments({ author: creatorId }),
      Article.countDocuments({ author: creatorId, status: "published" }),
      Article.countDocuments({ author: creatorId, status: "pending" }),
      Article.countDocuments({ author: creatorId, status: "draft" }),
    ]);

    res.status(200).json({ articles, publishedArticles, pendingArticles, draftArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getAllUsers,
  toggleUserStatus,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  getPlatformStats,
  getCreatorStats,
};