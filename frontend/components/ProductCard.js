import Link from 'next/link';
import Stars from './Stars';
import { useRouter } from 'next/router';
import { addToCart } from '@/utils/cart';

export default function ProductCard({ product, mode = 'retail', token, onOpenCart }) {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Determine which price to display
  const displayPrice = mode === 'wholesale' && product.bulkPrice 
    ? product.bulkPrice 
    : product.price;

  const handleCreateAlert = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    const targetPrice = prompt(
      `Establecer precio objetivo para ${product.name} (actual: $${displayPrice})`
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
        alert('✓ Alerta creada exitosamente');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'No se pudo crear la alerta'}`);
      }
    } catch (error) {
      alert('Error al crear la alerta');
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      router.push('/login');
      return;
    }

    const cartProduct = {
      ...product,
      storeId: product.storeId || 1,
      storeName: product.storeName || 'Store',
      image: product.image || '📦',
    };

    addToCart(cartProduct, 1);
    alert('✓ Producto agregado al carrito');
    onOpenCart?.();
  };

  const handleCheckout = () => {
    if (product.storeName && product.website) {
      window.open(`${product.website}?product=${product.id}`, '_blank');
    } else {
      alert('URL de pago no disponible');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-400/60 transition group hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
      {/* Image Placeholder */}
      <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 h-40 flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition">
        <div className="text-5xl">{product.image || '📦'}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/product/${product.id}`} className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition cursor-pointer block">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating || 4} />
          <span className="text-xs text-blue-300">
            {product.rating ? `${product.rating.toFixed(1)}/5` : 'Nuevo'}
            {product.ratingCount ? ` (${product.ratingCount})` : ''}
          </span>
        </div>

        {/* Store */}
        {product.storeName && (
          <p className="text-sm text-blue-200 mb-3 truncate">📍 {product.storeName}</p>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="text-3xl font-black text-cyan-300 mb-1">${displayPrice.toFixed(2)}</div>
          {mode === "wholesale" && product.bulkPrice && (
            <p className="text-xs text-emerald-300">💼 Mayorista: ${product.bulkPrice}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCreateAlert}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            🔔 Alerta
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
          >
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
