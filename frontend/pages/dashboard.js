import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardSavings from '@/components/DashboardSavings';
import { apiCall } from '@/utils/fetcher';

export const getServerSideProps = async () => {
  return { props: {} };
};

const fetcher = (url, token) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch');
    return r.json();
  });

export default function Dashboard({ token, user }) {
  const router = useRouter();

  if (!token) {
    router.push('/login');
    return null;
  }

  const { data: savings = [], error: savingsError } = useSWR(
    `/api/admin/monthly-savings/${user?.id}`,
    (url) => fetcher(url, token)
  );

  const { data: points = 0, error: pointsError } = useSWR(
    `/api/admin/points/${user?.id}`,
    (url) => fetcher(url, token).then((r) => r.points || 0)
  );

  const mockSavings = [
    { month_year: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], savings_amount: 45.50 },
    { month_year: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], savings_amount: 62.30 },
    { month_year: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], savings_amount: 38.75 },
    { month_year: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], savings_amount: 71.20 },
    { month_year: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], savings_amount: 55.90 },
    { month_year: new Date().toISOString().split('T')[0], savings_amount: 48.60 },
  ];

  const savingsToDisplay = savings && savings.length > 0 ? savings : mockSavings;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 mb-1">Account Email</div>
            <div className="text-2xl font-bold text-gray-900">{user?.email}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="text-sm text-gray-600 mb-1">Loyalty Points</div>
            <div className="text-2xl font-bold text-green-600">{points}</div>
            <div className="text-xs text-gray-500 mt-2">Redeem for discounts</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="text-sm text-gray-600 mb-1">Saved Alerts</div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-gray-500 mt-2">
              <a href="/alerts" className="text-blue-600 hover:underline">
                Manage alerts
              </a>
            </div>
          </div>
        </div>

        {/* Savings Chart */}
        {savingsToDisplay.length > 0 && (
          <div className="mb-8">
            <DashboardSavings savingsData={savingsToDisplay} />
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/"
                className="block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-center font-medium"
              >
                Browse Products
              </a>
              <a
                href="/alerts"
                className="block px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-center font-medium"
              >
                View My Alerts
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rewards Program</h2>
            <p className="text-gray-700 text-sm mb-4">
              Earn points for every purchase and alert you create. Redeem points for discounts or free shipping.
            </p>
            <div className="text-center">
              <button
                disabled
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed font-medium"
              >
                Redeem Points (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
