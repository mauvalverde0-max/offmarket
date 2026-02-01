import { useState } from 'react';

export default function AlertForm({ productId, onAlertCreated, token }) {
  const [targetPrice, setTargetPrice] = useState('');
  const [radius, setRadius] = useState(50);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          target_price: parseFloat(targetPrice),
          radius,
        }),
      });

      if (res.ok) {
        const alert = await res.json();
        setTargetPrice('');
        onAlertCreated(alert);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Price Alert</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="e.g. 7.99"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius (km)
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !targetPrice}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </div>
    </form>
  );
}
