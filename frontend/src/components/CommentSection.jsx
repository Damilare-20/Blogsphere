import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CommentSection({ articleId }) {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/articles/${articleId}/comments`
      );
      const data = await res.json();
      setComments(data);
    } catch {
      setError("Could not load comments");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate("/register");
      return;
    }

    if (!text.trim()) return;

    setPosting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/articles/${articleId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: text }),
        }
      );

      if (!res.ok) throw new Error("Could not post comment");

      const newComment = await res.json();
      
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-16 border-t border-line pt-10">
      <h2 className="font-display text-xl font-bold text-teal">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="mt-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-teal focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={posting || (user && !text.trim())}
          className="mt-3 rounded-pill bg-teal px-5 py-2 text-sm font-semibold text-cream transition hover:bg-tealdark disabled:opacity-50"
        >
          {posting ? "Posting..." : user ? "Post comment" : "Sign up to comment"}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {loading ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet  be the first.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach text-sm font-semibold text-orange">
                {comment.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-teal">
                  {comment.user?.name || "Unknown"}
                </p>
                <p className="mt-0.5 text-sm text-muted">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}