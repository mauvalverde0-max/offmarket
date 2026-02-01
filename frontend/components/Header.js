import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCartItemCount } from '@/utils/cart';
import { useLanguage } from '@/utils/i18n';

export default function Header({ user, token, onLogout, onCartOpen }) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCartCount(getCartItemCount());
    const interval = setInterval(() => setCartCount(getCartItemCount()), 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    onLogout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const handleCartOpen = () => {
    onCartOpen?.();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="text-3xl font-bold text-white">🛒 Offmarket</div>
          <span className="hidden sm:inline text-sm text-blue-100">Smart Shopping</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-blue-700 rounded-lg p-1">
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded transition text-sm font-medium ${
                language === 'es'
                  ? 'bg-white text-blue-700'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              🇦🇷 ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded transition text-sm font-medium ${
                language === 'en'
                  ? 'bg-white text-blue-700'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>

          {token && user ? (
            <>
              <Link href="/alerts" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                🔔 Alertas
              </Link>
              <Link href="/loyalty-points" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                🎁 Puntos
              </Link>
              <Link href="/assistant" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                🤖 IA
              </Link>
              <Link href="/dashboard" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                📊 Dashboard
              </Link>

              {/* Carrito */}
              <button
                onClick={handleCartOpen}
                className="relative text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                🛒 Carrito
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin si es local */}
              {user.role === 'local' && (
                <Link href="/local/products/manage" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition border-l border-blue-400 pl-6">
                  🏪 Mis Productos
                </Link>
              )}

              <span className="text-sm text-blue-100 hidden lg:inline pl-4 border-l border-blue-400">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Ingresar
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Language Selector */}
          <div className="flex items-center gap-0.5 bg-blue-700 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                language === 'es'
                  ? 'bg-white text-blue-700'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                language === 'en'
                  ? 'bg-white text-blue-700'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={handleCartOpen}
            className="relative text-white text-2xl hover:opacity-80 transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center -mr-2 -mt-2">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white text-2xl hover:opacity-80 transition"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500 p-4 space-y-2">
          {token && user ? (
            <>
              <Link href="/alerts" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                🔔 Alertas
              </Link>
              <Link href="/loyalty-points" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                🎁 Puntos
              </Link>
              <Link href="/assistant" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                🤖 IA
              </Link>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                📊 Dashboard
              </Link>

              {user.role === 'local' && (
                <Link href="/local/products/manage" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition border-t border-blue-600 pt-3 mt-3">
                  🏪 Mis Productos
                </Link>
              )}

              <div className="pt-3 border-t border-blue-600">
                <p className="px-4 py-2 text-sm text-blue-200">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                Ingresar
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition font-medium">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
