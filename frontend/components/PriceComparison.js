import React, { useState } from 'react';
import { fetchSupermarketPrices, findCheapest, calculateSavings, getSupermarketInfo } from '@/utils/supermarketAPI';
import { useLanguage } from '@/utils/i18n';

export default function PriceComparison() {
  const { language, t } = useLanguage();
  const [searchProduct, setSearchProduct] = useState('');
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchProduct.trim()) return;

    setLoading(true);
    setError('');
    try {
      const result = await fetchSupermarketPrices(searchProduct);
      setPrices(result);
    } catch (err) {
      setError(language === 'es' ? 'Error al buscar precios' : 'Error searching prices');
      setPrices(null);
    }
    setLoading(false);
  };

  const cheapest = prices ? findCheapest(prices) : null;
  const savings = prices ? calculateSavings(prices) : null;

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        💰 {language === 'es' ? 'Comparador de Precios' : 'Price Comparison'}
      </h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder={language === 'es' ? 'Buscar producto...' : 'Search product...'}
            className="flex-1 px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? '🔄' : '🔍'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Price Comparison Results */}
      {prices && (
        <div className="space-y-4">
          {/* Savings Summary */}
          {savings && savings.savings > 0 && (
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
              <p className="text-sm text-green-700">
                💚 {language === 'es'
                  ? `Puedes ahorrar $${savings.savings} (${savings.percentage}%) eligiendo el supermercado más barato`
                  : `You can save $${savings.savings} (${savings.percentage}%) by choosing the cheapest supermarket`}
              </p>
            </div>
          )}

          {/* Supermarkets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(prices).map(([key, priceData]) => {
              const isCheapest = cheapest && cheapest[0] === key;
              const info = getSupermarketInfo(key);

              return (
                <div
                  key={key}
                  className={`rounded-lg p-4 transition transform hover:scale-105 ${
                    isCheapest
                      ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-2 border-yellow-500 shadow-lg'
                      : 'bg-white border border-gray-300 shadow'
                  }`}
                >
                  {isCheapest && (
                    <div className="text-center mb-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                        🏆 {language === 'es' ? 'MÁS BARATO' : 'CHEAPEST'}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-2xl mb-1">{info?.icon}</p>
                    <h3 className="font-bold text-gray-900">{priceData.name}</h3>
                    <p className="text-3xl font-bold text-blue-600 my-2">${priceData.price}</p>

                    {priceData.discount > 0 && (
                      <p className="text-sm text-red-600 font-semibold">
                        -{priceData.discount}% {language === 'es' ? 'Desc.' : 'Off'}
                      </p>
                    )}

                    {!priceData.available && (
                      <p className="text-xs text-gray-500 mt-2">
                        {language === 'es' ? 'No disponible' : 'Not available'}
                      </p>
                    )}

                    {priceData.available && (
              </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Ahorro</p>
            <p className="text-xl font-bold text-red-400">${savings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabla de precios */}
      <div className="space-y-2">
        {prices.map((price) => (
          <div
            key={price.storeId}
            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
          >
            <div>
              <p className="text-white font-medium">{price.storeName}</p>
              <p className="text-xs text-gray-400">{price.distance.toFixed(1)} km</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-400">${price.price.toFixed(2)}</p>
              {price.price === minPrice && (
                <p className="text-xs text-yellow-300 font-semibold">🏆 Más barato</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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
