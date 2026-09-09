import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`);
        if (!res.ok) {
          throw new Error("Article not found");
        }
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
        <p className="px-4 py-16 text-center text-muted">Loading article...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
        <div className="px-4 py-16 text-center">
          <p className="text-muted">{error || "Something went wrong."}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-teal"
          >
            &larr; Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-teal">
              Back to articles
            </Link>

            <span className="inline-block rounded-pill bg-peach px-3 py-1 text-xs font-semibold text-orange">
              {article.category?.name}
            </span>
          </div>

          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="mt-4 h-64 w-full rounded-2xl object-cover"
            />
          )}

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-teal sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted">
            <span>By {article.author?.name || "Unknown"}</span>
            <span></span>
            <span>{article.views} views</span>
          </div>

          <div
            className="mt-8 font-serif text-lg leading-relaxed text-teal/90 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-orange [&_a]:underline [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <CommentSection articleId={id} />
        </div>
      </section>
    </main>
  );
}