import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  Menu,
  Search,
  X,
  Home,
  Compass,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  LogOut,
  PenSquare,
} from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-medium transition ${
    isActive
      ? "bg-white text-tealdark shadow-sm"
      : "text-tealdark/75 hover:bg-white/50 hover:text-tealdark"
  }`;

const mobileRowClass =
  "flex items-center gap-3 border-b border-line px-1 py-3.5 text-sm font-medium text-tealdark transition last:border-b-0 hover:text-orange";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/?search=${encodeURIComponent(trimmed)}#articles`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-[#f3f7ef] px-3 py-2 sm:px-6 sm:py-0">
      <nav className="mx-auto max-w-6xl rounded-3xl bg-[#f3f7ef] p-1 shadow-sm sm:rounded-4xl">
        <div className="rounded-3xl bg-white px-3 py-2 sm:rounded-pill sm:px-5">
          <div className="flex items-center gap-2">
          <Link
            to="/"
            className="shrink-0 px-2 py-1.5 font-display text-sm font-extrabold text-tealdark"
            onClick={() => setMenuOpen(false)}
          >
            Blog<span className="text-orange">Sphere</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden min-w-28 max-w-52 flex-1 sm:block">
            <label className="flex items-center gap-2 rounded-pill border border-tealdark/30 bg-white/75 px-2.5 py-1.5 text-xs text-tealdark/70">
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles"
                className="w-full bg-transparent text-tealdark outline-none placeholder:text-tealdark/60 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="shrink-0 text-tealdark/50 transition hover:text-teal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 text-tealdark/70 transition hover:text-teal"
              >
                <Search className="h-4 w-4" />
              </button>
            </label>
          </form>

          <div className="hidden min-w-max flex-1 items-center justify-center gap-1 sm:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>

            
             <NavLink to="/#articles" className={navLinkClass}>
              Explore
            </NavLink>
            {user && (
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            )}
            {(user?.role === "creator" || user?.role === "admin") && (
              <NavLink to="/creator" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-1 sm:flex">
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="whitespace-nowrap rounded-pill px-2.5 py-1.5 text-xs font-medium text-tealdark/75 transition hover:bg-white/50 hover:text-tealdark"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="whitespace-nowrap rounded-pill px-2.5 py-1.5 text-xs font-medium text-tealdark/75 transition hover:bg-white/50 hover:text-tealdark"
              >
                Log in
              </Link>
            )}
            {user?.role === "creator" || user?.role === "admin" ? (
              <Link
                to="/creator/new"
                className="whitespace-nowrap rounded-pill bg-teal px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-teal/80"
              >
                Write
              </Link>
            ) : !user ? (
              <Link
                to="/register"
                className="whitespace-nowrap rounded-pill bg-teal px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-teal/80"
              >
                Get started
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="ml-auto rounded-xl p-2 text-tealdark transition hover:bg-[#f3f7ef] sm:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          </div>

          {menuOpen && (
            <div className="sm:hidden">
              <div className="mt-2 border-t border-line pt-3">
                <form onSubmit={handleSearch}>
                  <label className="flex items-center gap-2 rounded-xl border border-tealdark/30 bg-white/75 px-3 py-2.5 text-xs text-tealdark/70">
                    <span className="sr-only">Search articles</span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search articles"
                      className="w-full bg-transparent text-tealdark outline-none placeholder:text-tealdark/60 [&::-webkit-search-cancel-button]:appearance-none"
                    />
                    {searchTerm && (
                      <button type="button" onClick={() => setSearchTerm("")} className="shrink-0 text-tealdark/50">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button type="submit" className="shrink-0 text-tealdark/70">
                      <Search className="h-4 w-4" />
                    </button>
                  </label>
                </form>
              </div>

              <div className="mt-3 rounded-2xl border border-line bg-white px-3">
                <NavLink to="/" end className={mobileRowClass} onClick={() => setMenuOpen(false)}>
                  <Home className="h-5 w-5 text-tealdark/70" />
                  Home
                </NavLink>
                <NavLink to="/#articles" className={mobileRowClass} onClick={() => setMenuOpen(false)}>
                  <Compass className="h-5 w-5 text-tealdark/70" />
                  Explore
                </NavLink>
                {user && (
                  <NavLink to="/profile" className={mobileRowClass} onClick={() => setMenuOpen(false)}>
                    <User className="h-5 w-5 text-tealdark/70" />
                    Profile
                  </NavLink>
                )}
                {(user?.role === "creator" || user?.role === "admin") && (
                  <NavLink to="/creator" className={mobileRowClass} onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="h-5 w-5 text-tealdark/70" />
                    Dashboard
                  </NavLink>
                )}
                {user?.role === "admin" && (
                  <NavLink to="/admin" className={mobileRowClass} onClick={() => setMenuOpen(false)}>
                    <ShieldCheck className="h-5 w-5 text-tealdark/70" />
                    Admin
                  </NavLink>
                )}
                {user ? (
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className={`${mobileRowClass} w-full text-left`}
                  >
                    <LogOut className="h-5 w-5 text-tealdark/70" />
                    Log out
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className={mobileRowClass}>
                    <LogIn className="h-5 w-5 text-tealdark/70" />
                    Log in
                  </Link>
                )}
              </div>

              <div className="mt-3 pb-3">
                {user?.role === "creator" || user?.role === "admin" ? (
                  <Link
                    to="/creator/new"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-pill bg-tealdark px-4 py-3.5 text-sm font-semibold text-cream"
                  >
                    <PenSquare className="h-4 w-4" />
                    Write article
                  </Link>
                ) : !user ? (
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-pill bg-tealdark px-4 py-3.5 text-sm font-semibold text-cream"
                  >
                    <PenSquare className="h-4 w-4" />
                    Get started
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}