// pages/admin/AdminDashboard.jsx
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load platform stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  const cards = stats
    ? [
        { label: "Total users", value: stats.users },
        { label: "Total articles", value: stats.articles },
        { label: "Published", value: stats.publishedArticles },
        { label: "Pending review", value: stats.pendingArticles },
      ]
    : [];

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-teal">
              Admin dashboard
            </h1>
            <p className="mt-1 text-sm text-muted">
              An overview of everything happening on BlogSphere.
            </p>
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

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/admin/moderation"
              className="rounded-pill bg-teal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-tealdark"
            >
              Review pending articles
              {stats?.pendingArticles > 0 && ` (${stats.pendingArticles})`}
            </Link>
            <Link
              to="/admin/users"
              className="rounded-pill border border-line bg-white px-6 py-3 text-sm font-semibold text-teal shadow-sm transition hover:border-teal/40"
            >
              Manage users
            </Link>
            <Link
              to="/admin/categories"
              className="rounded-pill border border-line bg-white px-6 py-3 text-sm font-semibold text-teal shadow-sm transition hover:border-teal/40"
            >
              Manage categories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}