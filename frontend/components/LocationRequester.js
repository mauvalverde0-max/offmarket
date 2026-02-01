import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';

export default function LocationRequester({ onLocationReceived }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const loc = JSON.parse(savedLocation);
      setLocation(loc);
      setStatus('enabled');
      onLocationReceived?.(loc);
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported in your browser');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { latitude, longitude, timestamp: Date.now() };
        
        localStorage.setItem('userLocation', JSON.stringify(loc));
        setLocation(loc);
        setStatus('enabled');
        onLocationReceived?.(loc);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setStatus('error');
      }
    );
  };

  if (status === 'enabled' && location) {
    return (
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📍</span>
          <span className="text-green-300">{t('location_enabled')}</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('userLocation');
            setLocation(null);
            setStatus('idle');
          }}
          className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-300 font-semibold">{t('enable_location_msg')}</p>
          <p className="text-xs text-blue-200 mt-1">
            Tus datos de ubicación se guardan localmente y no se comparten
          </p>
        </div>
        <button
          onClick={requestLocation}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white rounded-lg font-medium transition"
        >
          {status === 'loading' ? 'Habilitando...' : t('enable_location')}
        </button>
      </div>
    </div>
  );
}
