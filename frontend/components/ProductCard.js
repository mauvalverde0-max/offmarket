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
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-400/60 transition group hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
      {/* Image Placeholder */}
      <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 h-40 flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition">
        <div className="text-5xl">📦</div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-blue-300">
            {product.rating ? `${product.rating.toFixed(1)}/5` : 'New'}
            {product.rating_count ? ` (${product.rating_count})` : ''}
          </span>
        </div>

        {/* Store */}
        {product.store_name && (
          <p className="text-sm text-blue-200 mb-3 truncate">📍 {product.store_name}</p>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="text-3xl font-black text-cyan-300 mb-1">${displayPrice.toFixed(2)}</div>
          {mode === "wholesale" && product.min_quantity && (
            <p className="text-xs text-emerald-300">💼 Min: {product.min_quantity} units</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCreateAlert}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            🔔 Alert
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
          >
            🛒 Buy
          </button>
        </div>
      </div>
    </div>
  );
}
