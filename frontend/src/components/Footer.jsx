export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#f3f7ef] pb-4 pt-12">
      <section className="border border-line bg-[#e8f0e5] px-5 py-12 text-center text-tealdark shadow-[0_24px_70px_rgba(31,78,70,0.08)] sm:px-8 sm:py-14 mx-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">
            The BlogSphere newsletter
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Stay curious. Read something{" "}
            <span className="font-normal italic text-orange">worthwhile.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-tealdark/70">
            A thoughtful note in your inbox with fresh articles, new voices, and
            ideas worth your attention.
          </p>
          <form
            className="mx-auto mt-7 flex max-w-lg flex-col gap-2 rounded-2xl border border-line bg-white/70 p-1.5 sm:flex-row sm:rounded-pill"
            onSubmit={(event) => event.preventDefault()}
          >
            {" "}
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              required
              className="min-w-0 flex-1 rounded-pill bg-transparent px-4 py-2.5 text-sm text-tealdark outline-none placeholder:text-muted focus:ring-2 focus:ring-teal"
            />
            <button
              type="submit"
              className="rounded-pill bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-tealdark"
            >
              Subscribe <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
          <p className="mt-3 text-xs text-tealdark/60">
            No noise. Unsubscribe whenever you like.
          </p>
        </div>
      </section>

      <section className="bg-tealdark px-4 py-14 text-cream sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <p className="font-display text-2xl font-extrabold">
                Blog<span className="text-orange">Sphere</span>
              </p>
              <p className="mt-4 max-w-xs text-sm leading-6 text-cream/70">
                A home for clear thinking and stories with somewhere to go.
              </p>

              <a
                href="mailto:hello@blogsphere.com"
                className="mt-6 inline-block text-sm font-semibold text-[#d9f5a8] transition hover:text-cream"
              >
                hello@blogsphere.com
              </a>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cream/50">
                Discover
              </h3>
              <div className="mt-4 space-y-3 text-sm text-cream/70">
                <a
                  className="block transition hover:text-cream"
                  href="/#articles"
                >
                  Latest articles
                </a>
                <a
                  className="block transition hover:text-cream"
                  href="/register"
                >
                  Become a writer
                </a>
                <a className="block transition hover:text-cream" href="/login">
                  Sign in
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cream/50">
                Company
              </h3>
              <div className="mt-4 space-y-3 text-sm text-cream/70">
                <a
                  className="block transition hover:text-cream"
                  href="mailto:hello@blogsphere.com"
                >
                  Contact
                </a>
                <a
                  className="block transition hover:text-cream"
                  href="/#articles"
                >
                  Community
                </a>
                <a
                  className="block transition hover:text-cream"
                  href="/#articles"
                >
                  About BlogSphere
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cream/50">
                Follow along
              </h3>
              <div className="mt-4 space-y-3 text-sm text-cream/70">
                <a
                  className="block transition hover:text-cream"
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="block transition hover:text-cream"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="block transition hover:text-cream"
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  X / Twitter
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-cream/20 pt-5 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2026 BlogSphere. Built for better conversations.</span>
            <div className="flex gap-5">
              <a className="transition hover:text-cream" href="/#articles">
                Privacy
              </a>
              <a className="transition hover:text-cream" href="/#articles">
                Terms
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
