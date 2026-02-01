/**
 * Componente de Comparador de Precios
 * Muestra comparación de precios entre tiendas
 */

import { useState, useEffect } from 'react';
import { mockStores, mockProducts } from '@/utils/mockData';

export default function PriceComparison({ productId }) {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // Simular obtener precios del mismo producto en diferentes tiendas
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      const storePrices = mockStores.map((store) => ({
        storeId: store.id,
        storeName: store.name,
        price: product.price + (Math.random() * 2 - 1), // Variar precio
        distance: Math.random() * 10,
      }));
      setPrices(storePrices.sort((a, b) => a.price - b.price));
    }
  }, [productId]);

  if (prices.length === 0) return null;

  const minPrice = Math.min(...prices.map((p) => p.price));
  const maxPrice = Math.max(...prices.map((p) => p.price));
  const savings = maxPrice - minPrice;

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        💰 Comparar Precios
      </h3>

      {/* Resumen */}
      <div className="mb-4 p-4 bg-slate-800 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Precio Más Bajo</p>
            <p className="text-xl font-bold text-green-400">${minPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Precio Promedio</p>
            <p className="text-xl font-bold text-blue-300">
              ${(prices.reduce((sum, p) => sum + p.price, 0) / prices.length).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Ahorros Posibles</p>
            <p className="text-xl font-bold text-yellow-400">${savings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Lista de tiendas */}
      <div className="space-y-2">
        {prices.map((item, idx) => (
          <div key={item.storeId} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            {/* Ranking */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">
              <span className="text-sm font-bold text-white">#{idx + 1}</span>
            </div>

            {/* Tienda */}
            <div className="flex-1">
              <p className="font-semibold text-white">{item.storeName}</p>
              <p className="text-xs text-gray-400">
                📍 {item.distance.toFixed(1)}km
              </p>
            </div>

            {/* Precio */}
            <div className="text-right">
              <p className="text-xl font-bold text-cyan-300">${item.price.toFixed(2)}</p>
              {item.price === minPrice && (
                <p className="text-xs text-green-400 font-semibold">Mejor precio</p>
              )}
            </div>

            {/* Botón */}
            <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold px-3 py-1 bg-blue-600/20 rounded">
              Ver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
