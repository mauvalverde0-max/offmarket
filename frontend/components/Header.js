import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCartItemCount } from '@/utils/cart';

export default function Header({ user, token, onLogout, onCartOpen }) {
  const router = useRouter();
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
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="text-3xl font-bold text-white">🛒 Offmarket</div>
            <span className="hidden sm:inline text-sm text-blue-100">Smart Shopping</span>
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          {token && user ? (
            <>
              <Link href="/alerts">
                <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  🔔 Alertas
                </a>
              </Link>
              <Link href="/loyalty-points">
                <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  🎁 Puntos
                </a>
              </Link>
              <Link href="/assistant">
                <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  🤖 IA
                </a>
              </Link>
              <Link href="/dashboard">
                <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  📊 Dashboard
                </a>
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
                <Link href="/local/products/manage">
                  <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition border-l border-blue-400 pl-6">
                    🏪 Mis Productos
                  </a>
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
              <Link href="/login">
                <a className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                  Ingresar
                </a>
              </Link>
              <Link href="/register">
                <a className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition">
                  Registrarse
                </a>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
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
              <Link href="/alerts">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                  🔔 Alertas
                </a>
              </Link>
              <Link href="/loyalty-points">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                  🎁 Puntos
                </a>
              </Link>
              <Link href="/assistant">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                  🤖 IA
                </a>
              </Link>
              <Link href="/dashboard">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                  📊 Dashboard
                </a>
              </Link>

              {user.role === 'local' && (
                <Link href="/local/products/manage">
                  <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition border-t border-blue-600 pt-3 mt-3">
                    🏪 Mis Productos
                  </a>
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
              <Link href="/login">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-blue-100 hover:text-white rounded-md transition">
                  Ingresar
                </a>
              </Link>
              <Link href="/register">
                <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition font-medium">
                  Registrarse
                </a>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
