import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
        if (!isEditing && data.length > 0) {
          setCategory(data[0]._id);
        }
      } catch {
        setError("Could not load categories");
      }
    }

    fetchCategories();
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load this article");
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category?._id || "");
        setCoverImage(data.coverImage || null);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id, isEditing, token]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "http://localhost:5000/api/articles/upload-image",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      setCoverImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEditing
        ? `http://localhost:5000/api/articles/${id}`
        : "http://localhost:5000/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category, coverImage }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not save article");
      }

      const saved = await res.json();

      if (!isEditing) {
        navigate(`/creator/edit/${saved._id}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitForReview() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/articles/${id}/submit`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not submit article");
      }

      setStatus("pending");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
        <p className="px-4 py-16 text-center text-muted">Loading article...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-teal">
            {isEditing ? "Edit article" : "New article"}
          </h1>

          {isEditing && (
            <span className="mt-2 inline-block rounded-pill bg-peach px-3 py-1 text-xs font-semibold text-orange">
              {status}
            </span>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-teal">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-teal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:border-teal focus:outline-none"
              >
                {categories.length === 0 && (
                  <option value="">No categories yet</option>
                )}
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal">
                Cover image
              </label>

              <label
                htmlFor="coverImageInput"
                className="mt-1 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-peach/20 px-4 py-10 text-center transition hover:border-teal/40 hover:bg-peach/30"
              >
                {uploading ? (
                  <>
                    <svg
                      className="h-6 w-6 animate-spin text-teal"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-teal">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-8 w-8 text-orange"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-teal">
                      {coverImage ? "Change image" : "Click to upload an image"}
                    </span>
                    <span className="text-xs text-muted">PNG, JPG, or WEBP</span>
                  </>
                )}
              </label>
              <input
                id="coverImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />

              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="mt-3 h-40 w-full rounded-xl object-cover"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="mt-1 font-serif [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-line [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-line [&_.ql-editor]:min-h-[240px] [&_.ql-editor]:text-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-pill bg-teal px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-tealdark disabled:opacity-50"
              >
                {saving ? "Saving..." : isEditing ? "Save changes" : "Save draft"}
              </button>

              {isEditing && status === "draft" && (
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={saving}
                  className="rounded-pill border border-line px-6 py-2.5 text-sm font-semibold text-teal transition hover:border-teal/40 disabled:opacity-50"
                >
                  Submit for review
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}