import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';

// Simular locales con coordenadas
const NEARBY_STORES = [
  { id: 1, name: 'SuperMercado Central', lat: 40.7128, lng: -74.0060, category: 'Supermercado', rating: 4.5 },
  { id: 2, name: 'Tienda de Electrónica', lat: 40.7150, lng: -74.0065, category: 'Electrónica', rating: 4.2 },
  { id: 3, name: 'Farmacia del Barrio', lat: 40.7110, lng: -74.0055, category: 'Farmacia', rating: 4.8 },
  { id: 4, name: 'Panadería Artesanal', lat: 40.7140, lng: -74.0070, category: 'Alimentos', rating: 4.6 },
  { id: 5, name: 'Ropa y Moda', lat: 40.7120, lng: -74.0080, category: 'Ropa', rating: 4.3 },
];

// Calcular distancia entre dos puntos (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyStores({ userLocation }) {
  const { t } = useLanguage();
  const [nearbyStores, setNearbyStores] = useState([]);
  const [radius, setRadius] = useState(5); // km

  useEffect(() => {
    if (!userLocation) return;

    const stores = NEARBY_STORES
      .map(store => ({
        ...store,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.lat,
          store.lng
        )
      }))
      .filter(store => store.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    setNearbyStores(stores);
  }, [userLocation, radius]);

  if (!userLocation) return null;

  return (
    <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 rounded-lg border border-blue-500/20 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          📍 {t('nearby_stores')}
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-300">Radio:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-blue-300 w-12">{radius} km</span>
        </div>
      </div>

      {nearbyStores.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">No hay locales cercanos en {radius} km</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyStores.map(store => (
            <div
              key={store.id}
              className="bg-slate-800 border border-blue-500/20 hover:border-blue-500/40 rounded-lg p-4 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg">{store.name}</h3>
                  <p className="text-sm text-blue-300">{store.category}</p>
                </div>
                <span className="text-sm bg-blue-600/30 px-2 py-1 rounded text-blue-300 flex-shrink-0">
                  ⭐ {store.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg text-blue-400 font-semibold">
                  {store.distance.toFixed(1)} {t('km_away')}
                </span>
                <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm rounded font-medium transition">
                  Ver Ofertas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
