import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function formatCount(value) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "");
}

export default function ArticleCard({ article }) {
  const { token } = useContext(AuthContext);
  const [liked, setLiked] = useState(article.liked || false);
  const [likeCount, setLikeCount] = useState(article.likeCount || 0);
  const [saved, setSaved] = useState(article.bookmarked || false);
  const [liking, setLiking] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const plainText = stripHtml(article.content);
  const excerpt = plainText.length > 150
    ? `${plainText.slice(0, 150)}...`
    : plainText;
  const authorName = article.author?.name || "Unknown author";
  const initials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const publishedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Recently";
  const commentCount = article.commentsCount ?? 0;

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!token || liking) return;

    setLiking(true);
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${article._id}/like`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Could not update like");

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  }

  async function handleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!token || bookmarking) return;

    setBookmarking(true);
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${article._id}/bookmark`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Could not update bookmark");

      const data = await res.json();
      setSaved(data.bookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarking(false);
    }
  }

  return (
    <article className="border-t border-line py-7 first:border-t-0">
      <Link to={`/articles/${article._id}`} className="group block">
        <div className="flex items-center gap-3 text-sm text-teal">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peach text-xs font-bold text-orange">
            {initials}
          </div>
          <span className="font-medium">{authorName}</span>
          <span className="text-muted">&middot; {publishedDate}</span>
        </div>

        <div className="mt-5 flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange">
              {article.category?.name || "Article"}
            </span>
            <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink transition group-hover:text-teal sm:text-3xl">
              {article.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-base leading-relaxed text-muted">
              {excerpt}
            </p>
          </div>

          {article.coverImage && (
            <img
              src={article.coverImage}
              alt=""
              className="h-24 w-32 shrink-0 rounded-sm object-cover sm:h-32 sm:w-48"
            />
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-center gap-5 text-sm text-muted">
        <button
          type="button"
          aria-label={liked ? "Unlike article" : "Like article"}
          title={liked ? "Unlike" : "Like"}
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 transition hover:text-orange disabled:opacity-50 ${liked ? "text-orange" : ""}`}
        >
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
          <span>{formatCount(likeCount)}</span>
        </button>
        <Link
          to={`/articles/${article._id}#comments`}
          aria-label="View comments"
          title="Comments"
          className="flex items-center gap-1.5 transition hover:text-teal"
        >
          <MessageCircle size={19} />
          <span>{formatCount(commentCount)}</span>
        </Link>
        <button type="button" aria-label="Repost article" title="Repost" className="transition hover:text-teal">
          <Repeat2 size={19} />
        </button>
        <button
          type="button"
          aria-label={saved ? "Remove bookmark" : "Bookmark article"}
          title={saved ? "Remove bookmark" : "Bookmark"}
          onClick={handleBookmark}
          disabled={bookmarking}
          className={`ml-auto transition hover:text-teal disabled:opacity-50 ${saved ? "text-teal" : ""}`}
        >
          <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
        </button>
        <button type="button" aria-label="More article options" title="More options" className="transition hover:text-teal">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </article>
  );
}