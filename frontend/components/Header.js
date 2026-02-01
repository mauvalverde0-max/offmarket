import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header({ user, token, onLogout }) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-3xl font-bold text-white">🛒 Offmarket</div>
          <span className="text-sm text-blue-100">Smart Shopping, Better Prices</span>
        </Link>

        <div className="flex items-center gap-6">
          {token && user ? (
            <>
              <Link
                href="/alerts"
                className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                🔔 Alerts
              </Link>
              <Link
                href="/assistant"
                className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                🤖 AI Assistant
              </Link>
              <Link
                href="/dashboard"
                className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                📊 Dashboard
              </Link>
              <span className="text-sm text-blue-100 border-l border-blue-400 pl-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
