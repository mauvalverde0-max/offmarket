import Link from 'next/link';
import Stars from './Stars';
import { useRouter } from 'next/router';

export default function ProductCard({ product, mode = 'retail', token }) {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Determine which price to display
  const displayPrice = mode === 'wholesale' && product.bulk_price 
    ? product.bulk_price 
    : product.price;

  const handleCreateAlert = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    const targetPrice = prompt(
      `Set target price for ${product.name} (current: $${displayPrice})`
    );
    if (!targetPrice) return;

    try {
      const res = await fetch(`${apiUrl}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          target_price: parseFloat(targetPrice),
          radius: 50,
        }),
      });

      if (res.ok) {
        alert('Alert created successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'Failed to create alert'}`);
      }
    } catch (error) {
      alert('Error creating alert');
    }
  };

  const handleCheckout = () => {
    if (product.store_name && product.website) {
      window.open(`${product.website}?product=${product.id}`, '_blank');
    } else {
      alert('Store checkout URL not available');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <Link href={`/product/${product.id}`}>
          <div className="cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {product.description || 'No description'}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <Stars value={product.rating} />
            <div className="text-xs text-gray-500 mt-1">
              {product.rating ? `${product.rating.toFixed(1)}/5` : 'No ratings'}
              {product.rating_count ? ` (${product.rating_count} reviews)` : ''}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ${displayPrice}
            </div>
            <div className="text-xs text-gray-500">{product.currency || 'USD'}</div>
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <div className="font-medium">{product.store_name}</div>
          {mode === 'wholesale' && product.min_quantity && (
            <div className="text-gray-600">Min: {product.min_quantity} units</div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCreateAlert}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            Create Alert
          </button>
          <button
            onClick={handleCheckout}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium text-sm"
          >
            Go to Store
          </button>
        </div>
      </div>
    </div>
  );
}
