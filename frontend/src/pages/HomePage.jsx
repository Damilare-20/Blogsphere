import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { API_URL } from "../config/api";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleClearSearch() {
    navigate("/");
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        // categories are a nice-to-have here; a failed fetch shouldn't block the page
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (searchTerm) params.set("search", searchTerm);

        const url = `${API_URL}/articles${params.toString() ? `?${params.toString()}` : ""}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Unable to load articles");
        }

        const data = await res.json();
        setArticles(Array.isArray(data.articles) ? data.articles : []);
      } catch (fetchError) {
        console.error("Failed to load articles:", fetchError);
        setError("Articles could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [selectedCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="relative overflow-hidden px-4 py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-pill bg-peach px-4 py-1.5 text-xs font-semibold text-orange">
              Read. Write. Discover.
            </span>

            <h1 className="mt-6 max-w-xl font-display text-4xl font-extrabold leading-tight text-teal sm:text-5xl">
              Stories worth reading, ideas worth sharing.
            </h1>

            <p className="mt-6 max-w-lg text-muted">
              A space where writers publish real thinking and readers find
              something worth their time. No noise, just articles.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              
              <a  href="#articles"
                className="rounded-pill bg-teal px-7 py-3 text-sm font-semibold text-cream transition hover:bg-tealdark"
              >
                Start reading
              </a>
              
              <a  href="/register"
                className="rounded-pill border border-line px-7 py-3 text-sm font-semibold text-teal transition hover:border-teal/40"
              >
                Become a writer
              </a>
            </div>
          </div>

          <div className="relative hidden h-[300px] lg:block">
            <div className="absolute right-8 top-6 w-64 -rotate-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
              <span className="rounded-pill bg-peach px-3 py-1 text-xs font-semibold text-orange">
                Culture
              </span>
              <div className="mt-3 h-3 w-4/5 rounded-full bg-teal/20" />
              <div className="mt-2 h-2 w-full rounded-full bg-line" />
              <div className="mt-1.5 h-2 w-3/5 rounded-full bg-line" />
            </div>

            <div className="absolute left-4 top-28 w-64 rotate-3 rounded-2xl border border-line bg-white p-6 shadow-md">
              <span className="rounded-pill bg-peach px-3 py-1 text-xs font-semibold text-orange">
                Technology
              </span>
              <h2 className="mt-3 font-display text-lg font-bold text-teal">
                Why writing still matters
              </h2>
              <p className="mt-2 text-sm text-muted">
                A short essay on thinking clearly in public.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="articles" className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-teal">
              {searchTerm
                ? `Results for "${searchTerm}"`
                : selectedCategory
                ? categories.find((c) => c._id === selectedCategory)?.name
                : "Latest articles"}
            </h2>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="text-xs font-semibold text-orange hover:text-teal"
              >
                Clear search
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === null
                    ? "bg-teal text-cream"
                    : "bg-white text-muted hover:border-teal/40 border border-line"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCategory(c._id)}
                  className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === c._id
                      ? "bg-teal text-cream"
                      : "bg-white text-muted hover:border-teal/40 border border-line"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-muted">Loading articles...</p>
          ) : error ? (
            <p className="mt-6 text-red-600">{error}</p>
          ) : articles.length === 0 ? (
            <p className="mt-6 text-muted">
              {searchTerm
                ? "No articles match your search."
                : selectedCategory
                ? "No articles in this category yet."
                : "No articles published yet."}
            </p>
          ) : (
            <div className="mt-6 max-w-4xl">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}