import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Stars from '@/components/Stars';
import ProductRating from '@/components/ProductRating';
import PriceComparison from '@/components/PriceComparison';
import { mockProducts, mockStores } from '@/utils/mockData';
import { addToCart } from '@/utils/cart';

export default function ProductDetail({ token, onOpenCart }) {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const prod = mockProducts.find((p) => p.id === parseInt(id));
      if (prod) {
        setProduct(prod);
        const st = mockStores.find((s) => s.id === prod.storeId);
        setStore(st);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Cargando producto...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!token) {
      router.push('/login');
      return;
    }

    addToCart(product, quantity);
    alert(`✓ ${quantity} × ${product.name} agregado al carrito`);
    onOpenCart?.();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          ← Volver
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Imagen del producto */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg h-96 flex items-center justify-center">
              <div className="text-9xl">{product.image}</div>
            </div>

            {/* Galería simulada */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-slate-800 border border-blue-500/20 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-blue-500/60 transition text-4xl"
                >
                  {product.image}
                </div>
              ))}
            </div>
          </div>

          {/* Información y compra */}
          <div className="space-y-6">
            {/* Título y calificación */}
            <div>
              <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Stars rating={product.rating || 4.5} />
                  <span className="text-blue-300 font-semibold">
                    {product.rating || 4.5}/5 ({product.ratingCount || 42} reseñas)
                  </span>
                </div>
              </div>
              <p className="text-gray-400 max-w-2xl">{product.description}</p>
            </div>

            {/* Tienda */}
            {store && (
              <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">📍 Vendido por</p>
                <h2 className="text-xl font-bold text-white mb-2">{store.name}</h2>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-300">⭐ {store.rating}/5</span>
                  <span className="text-gray-300">💬 {store.reviews} reseñas</span>
                  <span className="text-gray-300">✓ Verificado</span>
                </div>
              </div>
            )}

            {/* Precios */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-6">
              <p className="text-gray-400 mb-2">Precio</p>
              <div className="flex items-baseline gap-4 mb-4">
                <div className="text-5xl font-black text-cyan-300">
                  ${product.price.toFixed(2)}
                </div>
                {product.bulkPrice && (
                  <div className="text-sm">
                    <p className="text-gray-400">Mayorista</p>
                    <p className="text-xl font-bold text-emerald-400">
                      ${product.bulkPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Cantidad */}
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-3">Cantidad</p>
                <div className="flex items-center gap-3 bg-slate-700 rounded-lg w-fit p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-600 rounded text-white font-bold"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-600 rounded text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="p-3 bg-slate-800/50 rounded mb-6">
                <p className="text-sm text-gray-400">Subtotal ({quantity} × ${product.price})</p>
                <p className="text-2xl font-bold text-blue-300">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>

              {/* Botones de acción */}
              {token ? (
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-lg text-white font-bold transition"
                  >
                    💳 Comprar Ahora
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition"
                  >
                    🛒 Agregar al Carrito
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition">
                  Ingresar para Comprar
                </Link>
              )}

              {/* Info adicional */}
              <div className="mt-6 pt-6 border-t border-slate-700 space-y-3 text-sm">
                <p className="flex items-center gap-2 text-gray-300">
                  📦 Envío gratis para órdenes mayores a $50
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  ✓ Garantía de satisfacción o tu dinero de vuelta
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  🎁 Gana puntos de lealtad en esta compra
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de información adicional */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Comparación de precios */}
          <PriceComparison productId={product.id} />

          {/* Especificaciones */}
          <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-6">
            <h3 className="font-bold text-white mb-4">📋 Especificaciones</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Categoría</span>
                <span className="text-white font-semibold capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Disponibilidad</span>
                <span className="text-green-400 font-semibold">En stock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Envío</span>
                <span className="text-white font-semibold">2-3 días hábiles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Retorno</span>
                <span className="text-white font-semibold">30 días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Puntos Lealtad</span>
                <span className="text-blue-300 font-bold">+{Math.floor(product.price)} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="space-y-8">
          <ProductRating
            productId={product.id}
            productName={product.name}
            onRatingSubmit={() => alert('✓ Reseña enviada')}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}
