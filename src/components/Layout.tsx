import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Toaster } from 'sonner';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      <Toaster position="top-right" theme={theme} />
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Portfolio
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'text-zinc-900 dark:text-zinc-50'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm font-medium text-left text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

     <footer className="bg-zinc-900 border-t border-zinc-800 mt-16">

  {/* TOP SECTION */}
  <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">

    {/* BRAND */}
    <div>
      <h2 className="text-xl font-bold text-white">PK Portfolio</h2>
      <p className="text-zinc-400 mt-3 text-sm">
        Building modern, scalable web applications with clean UI & performance focus.
      </p>
    </div>

    {/* NAVIGATION */}
    <div>
      <h3 className="text-white font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-zinc-400 text-sm">
        <li><a href="/" className="hover:text-white">Home</a></li>
        <li><a href="/about" className="hover:text-white">About</a></li>
        <li><a href="/projects" className="hover:text-white">Projects</a></li>
        <li><a href="/contact" className="hover:text-white">Contact</a></li>
      </ul>
    </div>

    {/* SERVICES / SKILLS */}
    <div>
      <h3 className="text-white font-semibold mb-3">Services</h3>
      <ul className="space-y-2 text-zinc-400 text-sm">
        <li>Web Development</li>
        <li>UI/UX Design</li>
        <li>React Apps</li>
        <li>API Integration</li>
      </ul>
    </div>

    {/* CONTACT */}
    <div>
      <h3 className="text-white font-semibold mb-3">Contact</h3>
      <ul className="space-y-2 text-zinc-400 text-sm">
        <li>Email: prem@example.com</li>
        <li>Location: India</li>
      </ul>

      {/* SOCIAL */}
      <div className="flex gap-3 mt-4 text-zinc-400">
        <a href="#" className="hover:text-white">🌐</a>
        <a href="#" className="hover:text-white">🐦</a>
        <a href="#" className="hover:text-white">💼</a>
      </div>
    </div>

  </div>

  {/* NEWSLETTER */}
  <div className="border-t border-zinc-800 py-6">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h3 className="text-white font-semibold mb-2">Subscribe to Newsletter</h3>
      <p className="text-zinc-400 text-sm mb-4">
        Get latest updates and projects directly in your inbox.
      </p>

      <div className="flex max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-l-md outline-none"
        />
        <button className="bg-white text-black px-4 rounded-r-md">
          Subscribe
        </button>
      </div>
    </div>
  </div>

  {/* BOTTOM */}
  <div className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">
    © 2026 PK Portfolio. All rights reserved.
  </div>

</footer>
    </div>
  );
}
