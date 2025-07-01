import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGoogle, signOut, user } = useAuth();

  const displayName = user?.user_metadata?.name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            learn-react <span className="text-blue-500">SM</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8" role="menu" aria-label="Main navigation">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
              role="menuitem"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
              role="menuitem"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors"
              role="menuitem"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
              role="menuitem"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-3" role="menu" aria-label="User menu">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="ml-2 px-3 py-1 rounded bg-red-600 text-white hover:cursor-pointer hover:bg-red-400 transition-colors"
                  role="menuitem"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="hover:cursor-pointer"
                role="menuitem"
              >
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <div className="flex items-center">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tl to-[#211F70] from-[#2E2BE3]" />
                )}
              </div>
            )}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 bg-[rgba(10,10,10,0.95)] border-b border-white/10"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Home
              </Link>
              <Link
                to="/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Create Post
              </Link>
              <Link
                to="/communities"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Communities
              </Link>
              <Link
                to="/community/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                Create Community
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-white/10 pt-2 mt-2" role="menu" aria-label="User menu">
                {user ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-2">
                      {user.user_metadata?.avatar_url && (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-gray-300">{displayName}</span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded bg-red-600 text-white hover:bg-red-400 transition-colors text-left"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 text-left transition-colors"
                    role="menuitem"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
