// pages/creator/CreatorDashboard.jsx
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function CreatorDashboard() {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/stats/creator/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Could not load your stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, token]);

  const cards = stats
    ? [
        { label: "Total articles", value: stats.articles },
        { label: "Published", value: stats.publishedArticles },
        { label: "Pending review", value: stats.pendingArticles },
        { label: "Drafts", value: stats.draftArticles },
      ]
    : [];

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div>
              <h1 className="font-display text-2xl font-bold text-teal">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="mt-1 text-sm text-muted">
                Here's how your writing is doing.
              </p>
            </div>
            <Link
              to="/creator/new"
              className="rounded-pill bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-tealdark"
            >
              New article
            </Link>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <p className="mt-8 text-muted">Loading stats...</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm"
                >
                  <p className="text-3xl font-extrabold text-teal">{card.value}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/creator/articles"
            className="mt-10 inline-block rounded-pill border border-line bg-white px-6 py-3 text-sm font-semibold text-teal shadow-sm transition hover:border-teal/40"
          >
            View all my articles
          </Link>
        </div>
      </section>
    </main>
  );
}