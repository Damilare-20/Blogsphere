import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ROLE_STYLES = {
  admin: "bg-teal/10 text-teal",
  creator: "bg-peach text-orange",
  reader: "bg-line/40 text-muted",
};

export default function UserManagement() {
  const { user: currentUser, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id) {
    setTogglingId(id);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/toggle-status`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not update user");
      }

      const { user: updated } = await res.json();

      // flip just this one user's isActive locally instead of refetching everyone
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: updated.isActive } : u))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-teal">User management</h1>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-8 text-muted">Loading users...</p>
        ) : (
          <div className="mt-8 space-y-3">
            {users.map((u) => {
              const isSelf = u._id === currentUser?._id;

              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between rounded-2xl border border-line bg-white p-5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-teal">{u.name}</p>
                      <span
                        className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[u.role] || "bg-line/40 text-muted"}`}
                      >
                        {u.role}
                      </span>
                      {!u.isActive && (
                        <span className="rounded-pill bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                          Deactivated
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">{u.email}</p>
                  </div>

                  <button
                    onClick={() => handleToggle(u._id)}
                    disabled={isSelf || togglingId === u._id}
                    title={isSelf ? "You can't deactivate your own account" : undefined}
                    className="rounded-pill border border-line px-4 py-2 text-xs font-semibold text-teal transition hover:border-teal/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {togglingId === u._id
                      ? "..."
                      : u.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}