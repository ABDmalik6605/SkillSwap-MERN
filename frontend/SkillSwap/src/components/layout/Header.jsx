import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Button from '../ui/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import { logout } from '../../features/auth/authSlice.js';
import { Icons, Icon } from '../../utils/icons.jsx';
import NotificationBell from '../../features/notifications/NotificationBell.jsx';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="gradient-bg sticky top-0 z-50 backdrop-blur-xl border-b-4 border-white/30" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg">
            <Icon icon={Icons.logoSolid} size="xl" className="text-white" />
          </div>
          <span className="text-xl sm:text-3xl font-black text-white drop-shadow-lg group-hover:scale-110 transition-transform">
            SkillSwap
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          <Icon icon={mobileMenuOpen ? Icons.close : Icons.menu} size="lg" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link 
            to="/discover" 
            className="px-4 py-2 rounded-xl font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2 hover:scale-105"
          >
            <Icon icon={Icons.search} size="md" />
            Discover
          </Link>
          {isAuthenticated ? (
            <div className="flex gap-3 items-center">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-xl font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2 hover:scale-105"
              >
                <Icon icon={Icons.dashboard} size="md" />
                Dashboard
              </Link>
              <NotificationBell />
              <button
                onClick={() => dispatch(logout())}
                className="px-5 py-2 bg-white/90 hover:bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Icon icon={Icons.logout} size="md" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-white/30">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="px-5 py-2 bg-white hover:bg-white/95 text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
                  <Icon icon={Icons.rocket} size="md" />
                  Sign up free
                </button>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20">
          <nav className="flex flex-col p-4 gap-3">
            <Link 
              to="/discover" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2 text-center justify-center"
            >
              <Icon icon={Icons.search} size="md" />
              Discover
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2 text-center justify-center"
                >
                  <Icon icon={Icons.dashboard} size="md" />
                  Dashboard
                </Link>
                <div className="flex justify-center py-2">
                  <NotificationBell />
                </div>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setMobileMenuOpen(false);
                  }}
                  className="px-5 py-3 bg-white/90 hover:bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
                >
                  <Icon icon={Icons.logout} size="md" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-white/30">
                    Log in
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-5 py-3 bg-white hover:bg-white/95 text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center">
                    <Icon icon={Icons.rocket} size="md" />
                    Sign up free
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
