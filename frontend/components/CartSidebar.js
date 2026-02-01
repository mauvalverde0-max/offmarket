/**
 * Componente de Carrito Lateral
 * Muestra productos del carrito con opciones de modificación
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '@/utils/cart';

export default function CartSidebar({ isOpen, onClose }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setCart(getCart());
    setTotal(getCartTotal());
  }, [isOpen]);

  const handleUpdateQuantity = (productId, storeId, quantity) => {
    updateCartQuantity(productId, storeId, quantity);
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleRemove = (productId, storeId) => {
    removeFromCart(productId, storeId);
    setCart(getCart());
    setTotal(getCartTotal());
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-slate-900 border-l border-blue-500/30 transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-blue-500/30 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-300">🛒 Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
              <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2 rounded-lg text-white font-semibold transition">
                Seguir comprando
              </Link>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.storeId}`}
                  className="bg-slate-800 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition"
                >
                  {/* Producto */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.storeName}</p>
                      <p className="text-blue-300 font-bold">${item.price}</p>
                    </div>
                  </div>

                  {/* Cantidad y eliminar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-1">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.storeId, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-slate-600 rounded text-white"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-white font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.storeId, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-slate-600 rounded text-white"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.storeId)}
                      className="text-red-400 hover:text-red-300 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-right text-white">
                      Subtotal: <span className="font-bold text-blue-300">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              ))}

              {/* Total y checkout */}
              <div className="sticky bottom-0 bg-slate-900 border-t border-blue-500/30 p-6 space-y-4 mt-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-gray-300 text-sm mb-2">Total del carrito</p>
                  <p className="text-3xl font-bold text-blue-300">
                    ${total.toFixed(2)}
                  </p>
                </div>

                <Link href="/checkout"
                  onClick={onClose}
                  className="w-full block text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-lg text-white font-bold transition transform hover:scale-105"
                >
                  Proceder al Pago 💳
                </Link>

                <button
                  onClick={onClose}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Seguir comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
