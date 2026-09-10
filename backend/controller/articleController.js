const Article = require("../model/article");
const User = require("../model/user");

console.log("test");
async function createArticle(req, res) {
  try {
    const { title, content, category, coverImage } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const article = await Article.create({
      title,
      content,
      category,
      coverImage,
      author: req.user._id,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getAllArticles(req, res) {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const filter = { status: "published" };
    if (category) filter.category = category;
    if (search) filter.title = new RegExp(search, "i");

    const skip = (Number(page) - 1) * Number(limit);

    const articles = await Article.find(filter)
      .populate("author", "name profilePicture")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Article.countDocuments(filter);

    const articlesWithLikeInfo = articles.map((article) => {
      const obj = article.toObject();
      obj.likeCount = article.likes.length;
      obj.liked = req.user
        ? article.likes.some((id) => id.toString() === req.user._id.toString())
        : false;
      obj.bookmarked = req.user
        ? req.user.bookmarks.some((id) => id.toString() === article._id.toString())
        : false;
      delete obj.likes; 
      return obj;
    });

    res.status(200).json({
      articles: articlesWithLikeInfo,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
async function getArticleById(req, res) {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "name bio profilePicture")
      .populate("category", "name");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const isOwner =
      req.user && article.author._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (article.status !== "published" && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "This article is not available" });
    }

    if (article.status === "published" && !isOwner && req.user) {
      const alreadyViewed = article.viewedBy.some(
        (id) => id.toString() === req.user._id.toString(),
      );

      if (!alreadyViewed) {
        article.views += 1;
        article.viewedBy.push(req.user._id);
        await article.save();
      }
    }

    const articleObj = article.toObject();
    articleObj.likeCount = article.likes.length;
    articleObj.liked = req.user
      ? article.likes.some((id) => id.toString() === req.user._id.toString())
      : false;
    articleObj.bookmarked = req.user
      ? req.user.bookmarks.some((bookmark) => bookmark.toString() === article._id.toString())
      : false;
    delete articleObj.likes;
    delete articleObj.viewedBy;

    res.status(200).json(articleObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// @desc   Get the logged-in creator's own articles, regardless of status
// @route  GET /api/articles/my
async function getMyArticles(req, res) {
  try {
    const articles = await Article.find({ author: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getPendingArticles(req, res) {
  try {
    const articles = await Article.find({ status: "pending" })
      .populate("author", "name profilePicture")
      .populate("category", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updateArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const isOwner = article.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this article" });
    }

    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function submitForReview(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to submit this article" });
    }

    if (article.status !== "draft") {
      return res
        .status(400)
        .json({ message: "Only draft articles can be submitted for review" });
    }

    article.status = "pending";
    await article.save();

    res.status(200).json({ message: "Article submitted for review", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function toggleLike(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = article.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      article.likes = article.likes.filter((id) => id.toString() !== userId);
    } else {
      article.likes.push(req.user._id);
    }

    await article.save();

    res.status(200).json({
      likeCount: article.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function toggleBookmark(req, res) {
  try {
    const article = await Article.findById(req.params.id).select("_id");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const alreadyBookmarked = req.user.bookmarks.some(
      (bookmark) => bookmark.toString() === article._id.toString(),
    );
    const update = alreadyBookmarked
      ? { $pull: { bookmarks: article._id } }
      : { $addToSet: { bookmarks: article._id } };

    await User.findByIdAndUpdate(req.user._id, update);

    res.status(200).json({ bookmarked: !alreadyBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getBookmarkedArticles(req, res) {
  try {
    const articles = await Article.find({
      _id: { $in: req.user.bookmarks },
      status: "published",
    })
      .populate("author", "name profilePicture")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const isOwner = article.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this article" });
    }

    await article.deleteOne();
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  getPendingArticles,
  updateArticle,
  submitForReview,
  toggleLike,
  toggleBookmark,
  getBookmarkedArticles,
  deleteArticle,
};