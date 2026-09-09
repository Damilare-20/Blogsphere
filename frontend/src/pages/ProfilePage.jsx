import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ArticleCard from "../components/ArticleCard";

const ROLE_STYLES = {
  admin: "bg-teal/10 text-teal",
  creator: "bg-peach text-orange",
  reader: "bg-line/40 text-tealdark/70",
};

export default function ProfilePage() {
  const { user, token, updateUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", bio: "", profilePicture: null });

  function startEditing() {
    setForm({ name: user?.name || "", email: user?.email || "", bio: user?.bio || "", profilePicture: null });
    setEditing(true);
  }

  useEffect(() => {
    async function fetchMyComments() {
      try {
        const res = await fetch("http://localhost:5000/api/comments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load your comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyComments();

    async function fetchBookmarks() {
      try {
        const res = await fetch("http://localhost:5000/api/articles/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load your bookmarks");
        const data = await res.json();
        setBookmarks(data.map((article) => ({ ...article, bookmarked: true })));
      } catch (err) {
        setError(err.message);
      } finally {
        setBookmarksLoading(false);
      }
    }

    fetchBookmarks();
  }, [token]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handlePictureChange(event) {
    setForm((current) => ({ ...current, profilePicture: event.target.files[0] || null }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: (() => {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("email", form.email);
          formData.append("bio", form.bio);
          if (form.profilePicture) formData.append("profilePicture", form.profilePicture);
          return formData;
        })(),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Could not update your profile");

      updateUser(data);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f7ef] bg-[radial-gradient(circle_at_85%_8%,rgba(251,227,208,0.7),transparent_28%),radial-gradient(circle_at_12%_42%,rgba(217,245,168,0.45),transparent_24%)]">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            {!editing ? (
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={`${user.name}'s profile`} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-peach text-3xl font-bold text-orange">
                      {user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <h1 className="font-display text-2xl font-bold text-teal">{user?.name}</h1>
                    <p className="mt-0.5 text-sm text-muted">{user?.email}</p>
                    {user?.bio && <p className="mt-3 max-w-md text-sm text-tealdark/80">{user.bio}</p>}
                    <span className={`mt-2 inline-block rounded-pill px-3 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[user?.role] || "bg-line/40 text-tealdark/70"}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button type="button" onClick={startEditing} className="rounded-xl border border-teal px-4 py-2 text-sm font-bold text-teal transition hover:bg-teal hover:text-cream">
                  Edit profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <h1 className="font-display text-2xl font-bold text-teal">Edit profile</h1>
                <div>
                  <label htmlFor="profile-name" className="block text-xs font-bold uppercase tracking-wide text-teal">Name</label>
                  <input id="profile-name" name="name" value={form.name} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-xs font-bold uppercase tracking-wide text-teal">Email address</label>
                  <input id="profile-email" type="email" name="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
                </div>
                <div>
                  <label htmlFor="profile-bio" className="block text-xs font-bold uppercase tracking-wide text-teal">Bio</label>
                  <textarea id="profile-bio" name="bio" value={form.bio} onChange={handleChange} rows="3" maxLength="280" placeholder="Tell readers a little about yourself" className="mt-2 w-full resize-none rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none focus:border-teal focus:ring-4 focus:ring-teal/10" />
                </div>
                <div>
                  <label htmlFor="profile-picture" className="block text-xs font-bold uppercase tracking-wide text-teal">Profile picture</label>
                  <input id="profile-picture" name="profilePicture" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePictureChange} className="mt-2 block w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-peach file:px-3 file:py-2 file:font-semibold file:text-orange" />
                  <p className="mt-1 text-xs text-muted">PNG, JPG, or WebP</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setEditing(false); setError(""); }} className="rounded-xl border border-line px-4 py-2 text-sm font-bold text-muted transition hover:border-teal hover:text-teal">Cancel</button>
                  <button type="submit" disabled={saving} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-cream transition hover:bg-tealdark disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-bold text-teal">
              Saved articles {bookmarks.length > 0 && `(${bookmarks.length})`}
            </h2>

            {bookmarksLoading ? (
              <p className="mt-6 text-muted">Loading saved articles...</p>
            ) : bookmarks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center text-sm text-muted">
                You haven't bookmarked any articles yet.
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-line bg-white px-5 sm:px-7">
                {bookmarks.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-bold text-teal">
              Your comments {comments.length > 0 && `(${comments.length})`}
            </h2>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {loading ? (
              <p className="mt-6 text-muted">Loading...</p>
            ) : comments.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center text-sm text-muted">
                You haven't commented on anything yet.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded-2xl border border-line bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-tealdark/90">{comment.content}</p>
                    <Link
                      to={`/articles/${comment.article?._id}`}
                      className="mt-2 inline-block text-xs font-semibold text-orange transition hover:text-teal"
                    >
                      on "{comment.article?.title || "a deleted article"}"
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}