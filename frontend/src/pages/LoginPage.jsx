import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token, ...userFields } = data;
      login({ ...userFields, _id: userFields.id }, token);

      if (userFields.role === "admin") navigate("/admin");
      else if (userFields.role === "creator") navigate("/creator");
      else navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-9rem)] overflow-hidden bg-[#efeeeb] px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full border border-[#d8d8d2]" />
      <div className="pointer-events-none absolute -right-36 bottom-0 h-96 w-96 rounded-full border border-[#d8d8d2]" />

      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(31,78,70,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-teal p-12 text-cream lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-display text-xl font-extrabold">BlogSphere</p>
            <span className="mt-20 inline-block rounded-pill bg-[#d9f5a8] px-4 py-1.5 text-xs font-bold text-tealdark">
              A quieter place to think
            </span>
            <h2 className="mt-6 max-w-sm font-display text-4xl font-extrabold leading-tight">
              Come for the ideas. Stay for the conversation.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-cream/70">
              Read thoughtful work, follow curious writers, and share what you
              are learning.
            </p>
          </div>
          <p className="text-xs text-cream/50">Read. Write. Discover.</p>
        </div>

        <div className="px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-sm">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange">
              Welcome back
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-teal">
              Log in
            </h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to continue to BlogSphere.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-teal">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-4 focus:ring-teal/10"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wide text-teal">
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold text-orange">
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-2 w-full rounded-xl border border-line bg-[#fafaf8] px-4 py-3 text-sm text-teal outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-4 focus:ring-teal/10"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-teal px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-tealdark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted">
              New to BlogSphere?{" "}
              <Link to="/register" className="font-bold text-teal hover:text-orange">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
