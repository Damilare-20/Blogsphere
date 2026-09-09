import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reader");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login({ ...data.user, _id: data.user.id }, data.token);

      if (data.user.role === "creator") navigate("/creator");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-9rem)] overflow-hidden bg-[#efeeeb] px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border border-[#d8d8d2]" />
      <div className="pointer-events-none absolute -left-36 bottom-0 h-96 w-96 rounded-full border border-[#d8d8d2]" />

      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(31,78,70,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-6 py-10 sm:px-12 sm:py-14 lg:order-1">
          <div className="mx-auto max-w-sm">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange">
              Join the community
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-teal">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Choose your path, then start exploring BlogSphere.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-teal">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-teal">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-teal">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-4 focus:ring-teal/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-teal">I want to</label>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-[#f2f3ee] p-1">
            <button
              type="button"
              onClick={() => setRole("reader")}
              className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                role === "reader"
                  ? "bg-white text-teal shadow-sm"
                  : "text-muted hover:text-teal"
              }`}
            >
              Read
            </button>
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                role === "creator"
                  ? "bg-white text-teal shadow-sm"
                  : "text-muted hover:text-teal"
              }`}
            >
              Write
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-teal px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-tealdark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

            <p className="mt-8 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-teal hover:text-orange">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden bg-teal p-12 text-cream lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <p className="font-display text-xl font-extrabold">BlogSphere</p>
          <div>
            <span className="inline-block rounded-pill bg-[#d9f5a8] px-4 py-1.5 text-xs font-bold text-tealdark">
              Your ideas belong here
            </span>
            <h2 className="mt-6 max-w-sm font-display text-4xl font-extrabold leading-tight">
              Make room for better conversations.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-cream/70">
              Publish your perspective or find the next article that changes
              the way you see things.
            </p>
          </div>
          <p className="text-xs text-cream/50">Read. Write. Discover.</p>
        </div>
      </div>
    </main>
  );
}