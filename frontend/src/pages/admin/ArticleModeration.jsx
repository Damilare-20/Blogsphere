import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

export default function ArticleModeration() {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/articles/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActioningId(id);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/admin/articles/${id}/approve`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Could not approve article");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id) {
    const reason = window.prompt("Reason for rejecting this article (optional):");
    if (reason === null) return;

    setActioningId(id);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/admin/articles/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );
      if (!res.ok) throw new Error("Could not reject article");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-teal">
          Article moderation
        </h1>
        <p className="mt-1 text-sm text-muted">
          Articles submitted by creators, waiting for review.
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-muted">Loading...</p>
        ) : articles.length === 0 ? (
          <p className="mt-8 text-muted">Nothing pending review right now.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {articles.map((article) => (
              <div
                key={article._id}
                className="rounded-2xl border border-line bg-white p-6"
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="mb-5 h-64 w-full rounded-xl object-cover"
                  />
                )}

                <span className="rounded-pill bg-peach px-3 py-1 text-xs font-semibold text-orange">
                  {article.category?.name}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-teal">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  By {article.author?.name || "Unknown"}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {article.content}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleApprove(article._id)}
                    disabled={actioningId === article._id}
                    className="rounded-pill bg-teal px-5 py-2 text-sm font-semibold text-cream transition hover:bg-tealdark disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(article._id)}
                    disabled={actioningId === article._id}
                    className="rounded-pill border border-line px-5 py-2 text-sm font-semibold text-teal transition hover:border-teal/40 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}