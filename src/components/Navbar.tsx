import { useState } from "react";
import { Link } from "react-router";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <div>
        <div>
          <Link to={"/"}>
            Learn <span>React</span> <span>SM</span>
          </Link>

          {/* desktop links */}
          <div>
            <Link to={"/"}>Home</Link>
            <Link to={"/create"}>Create Post</Link>
            <Link to={"/communities"}>Communities</Link>
            <Link to={"/community/create"}>Create Community</Link>
          </div>

          {/* Mobile menu button */}
          <div>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
            >
              {menuOpen ? (
                // X icon
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
                  <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
          {/* Mobile menu */}
          {menuOpen && (
            <div>
              <div>
                <Link to={"/"}>Home</Link>
                <Link to={"/create"}>Create Post</Link>
                <Link to={"/communities"}>Communities</Link>
                <Link to={"/community/create"}>Create Community</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
