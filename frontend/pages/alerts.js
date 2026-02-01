import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { apiCall } from '@/utils/fetcher';

export default function Alerts({ token }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadAlerts();
  }, [token, router]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiCall('GET', '/api/alerts', null, token);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (id) => {
    try {
      await apiCall('PATCH', `/api/alerts/${id}`, {}, token);
      loadAlerts();
    } catch (err) {
      alert('Failed to toggle alert');
    }
  };

  const deleteAlert = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await apiCall('DELETE', `/api/alerts/${id}`, null, token);
      loadAlerts();
    } catch (err) {
      alert('Failed to delete alert');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Price Alerts</h1>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p className="mb-4">No price alerts yet.</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go back to products and create your first alert
              </a>
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.product_name}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>
                          <strong>Target Price:</strong> ${alert.target_price}
                        </div>
                        <div>
                          <strong>Current Price:</strong> ${alert.price}
                        </div>
                        <div>
                          <strong>Store:</strong> {alert.store_name || 'N/A'}
                        </div>
                        <div>
                          <strong>Search Radius:</strong> {alert.radius}km
                        </div>
                        <div>
                          <strong>Status:</strong>{' '}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              alert.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {alert.active ? 'Active' : 'Inactive'}
                          </span>
                          {alert.triggered && (
                            <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Triggered
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`block w-full px-4 py-2 rounded-lg font-medium text-sm ${
                          alert.active
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {alert.active ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="block w-full px-4 py-2 rounded-lg bg-red-50 text-red-800 hover:bg-red-100 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Alerts are automatically checked every 5 minutes. When a product drops to your target
            price, you'll receive an email notification.
          </p>
        </div>
      </div>
    </main>
  );
}
