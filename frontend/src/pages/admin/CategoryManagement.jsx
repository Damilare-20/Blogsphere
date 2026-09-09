// pages/admin/CategoryManagement.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config/api";

export default function CategoryManagement() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Could not load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create category");

      setCategories((prev) => [...prev, data]);
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not delete category");
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-teal">Categories</h1>

        <form onSubmit={handleCreate} className="mt-6 flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Technology"
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm focus:border-teal focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded-pill bg-teal px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-tealdark disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-muted">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="mt-8 text-muted">No categories yet — add your first one above.</p>
        ) : (
          <div className="mt-8 space-y-2">
            {categories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-3"
              >
                <span className="text-sm font-semibold text-teal">{c.name}</span>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}