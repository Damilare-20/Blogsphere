import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

const STATUS_STYLES = {
  draft: "bg-line/40 text-muted",
  pending: "bg-peach text-orange",
  published: "bg-teal/10 text-teal",
};

export default function MyArticles() {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyArticles() {
      try {
        const res = await fetch(`${API_URL}/articles/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load your articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyArticles();
  }, [token]);

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-teal">My articles</h1>
          <Link
            to="/creator/new"
            className="rounded-pill bg-teal px-5 py-2 text-sm font-semibold text-cream transition hover:bg-tealdark"
          >
            New article
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-muted">Loading your articles...</p>
        ) : error ? (
          <p className="mt-8 text-red-600">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-8 text-muted">
            You haven't written anything yet — hit "New article" to get started.
          </p>
        ) : (
          <div className="mt-8 space-y-3">
            {articles.map((article) => (
              <Link
                key={article._id}
                to={`/creator/edit/${article._id}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 transition hover:border-teal/30"
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt=""
                    className="mr-4 h-16 w-24 shrink-0 rounded-xl object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-teal">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {article.category?.name} &middot; {article.views} views
                  </p>
                </div>

                <span
                  className={`rounded-pill px-3 py-1 text-xs font-semibold ${STATUS_STYLES[article.status] || "bg-line/40 text-muted"}`}
                >
                  {article.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}