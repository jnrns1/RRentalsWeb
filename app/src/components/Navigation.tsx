import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navigation() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Fleet', path: '/fleet' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="px-[7vw] py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="micro-label text-gold gold-underline">
            Rochester Car Rental
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-gold'
                    : 'text-[#A6AAB4] hover:text-gold'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm flex items-center gap-1 transition-colors duration-300 ${
                  isActive('/admin')
                    ? 'text-gold'
                    : 'text-[#A6AAB4] hover:text-gold'
                }`}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <User size={14} className="text-gold" />
                  </div>
                  <span className="text-sm">{user?.firstName}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-[#A6AAB4] hover:text-gold transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={openLogin}
                  className="text-sm text-[#A6AAB4] hover:text-gold transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={openRegister}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-charcoal-light border-t border-white/5 px-[7vw] py-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm py-2 ${
                    isActive(item.path)
                      ? 'text-gold'
                      : 'text-[#A6AAB4] hover:text-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm py-2 flex items-center gap-2 ${
                    isActive('/admin')
                      ? 'text-gold'
                      : 'text-[#A6AAB4] hover:text-gold'
                  }`}
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <div className="border-t border-white/10 pt-4 mt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <User size={16} className="text-gold" />
                      <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-[#A6AAB4] hover:text-gold transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        openLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm text-[#A6AAB4] hover:text-gold transition-colors text-left"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        openRegister();
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn-primary text-xs py-2"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
