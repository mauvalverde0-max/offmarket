/**
 * Componente de Mapa Interactivo
 * Muestra ubicación del usuario y tiendas cercanas
 */

import { useState, useEffect } from 'react';
import { getLocationPermission, filterNearbyStores } from '@/utils/geolocation';
import { mockStores } from '@/utils/mockData';

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await getLocationPermission();
        setUserLocation(location);
        
        // Simular tiendas cercanas (en producción usaría API)
        const filtered = filterNearbyStores(
          mockStores,
          location.latitude,
          location.longitude,
          radius
        );
        setNearbyStores(filtered);
        setError(null);
      } catch (err) {
        console.error('Error de geolocalización:', err);
        setError(err.message);
        // Usar ubicación por defecto (NYC)
        const defaultLocation = { latitude: 40.7128, longitude: -74.006, accuracy: null };
        setUserLocation(defaultLocation);
        const filtered = filterNearbyStores(mockStores, 40.7128, -74.006, radius);
        setNearbyStores(filtered);
      } finally {
        setLoading(false);
      }
    };

    getUserLocation();
  }, [radius]);

  if (loading) {
    return (
      <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-8 text-center">
        <p className="text-gray-300 mb-4">Cargando ubicación...</p>
        <div className="inline-block animate-spin">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-4">
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          📍 Radio de búsqueda: {radius}km
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>1km</span>
          <span>50km</span>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-300">
          ⚠️ {error}. Mostrando tiendas simuladas.
        </div>
      )}

      {userLocation && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            📌 Tu ubicación: <span className="font-semibold text-blue-300">{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</span>
          </p>
        </div>
      )}

      {/* Lista de tiendas */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">
          🏪 Tiendas cercanas ({nearbyStores.length})
        </h3>

        {nearbyStores.length === 0 ? (
          <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-6 text-center">
            <p className="text-gray-400">No hay tiendas dentro de {radius}km</p>
          </div>
        ) : (
          nearbyStores.map((store) => (
            <div
              key={store.id}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/60 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg">{store.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">📍 {store.address}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-300">
                        {store.rating} ({store.reviews} reseñas)
                      </span>
                    </div>
                    <span className="bg-blue-600/40 px-2 py-1 rounded text-xs font-semibold text-blue-300">
                      {store.type === 'supermarket' ? '🛒 Supermercado' : store.type === 'wholesale' ? '📦 Mayorista' : '🏪 Local'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-300">
                    {store.distance ? store.distance.toFixed(1) : 'N/A'} km
                  </div>
                  <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition">
                    Ver productos
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
