const Comment = require("../model/comment");
const Article = require("../model/article");


async function addComment(req, res) {
  try {
    const { content } = req.body;
    const { articleId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.status !== "published") {
      return res.status(403).json({ message: "You can only comment on published articles" });
    }

    const comment = await Comment.create({
      article: articleId,
      user: req.user._id,
      content,
    });

    article.commentsCount = (article.commentsCount || 0) + 1;
    await article.save();

  
    const populated = await comment.populate("user", "name");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getCommentsForArticle(req, res) {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ article: articleId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    await Article.findByIdAndUpdate(comment.article, {
      $inc: { commentsCount: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getMyComments(req, res) {
  try {
    const comments = await Comment.find({ user: req.user._id })
      .populate("article", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { addComment, getCommentsForArticle, deleteComment, getMyComments };