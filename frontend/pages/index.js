import useSWR from 'swr';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import MapComponent from '@/components/MapComponent';
import PromotionBanner from '@/components/PromotionBanner';
import LocationRequester from '@/components/LocationRequester';
import NearbyStores from '@/components/NearbyStores';
import ImprovedChatbot from '@/components/ImprovedChatbot';
import { useLanguage } from '@/utils/i18n';
import Link from 'next/link';

const fetcher = (url, token) =>
  fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());

export default function Home({ token }) {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('retail'); // retail or wholesale
  const [userLocation, setUserLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(50);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => console.log('Geolocation error:', error)
      );
    }
  }, []);

  // Build query params
  let productsUrl = `${apiUrl}/api/products`;
  if (latitude && longitude) {
    productsUrl += `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  }

  const { data: products = [], error: productsError } = useSWR(
    productsUrl,
    (url) => fetcher(url, token)
  );

  const { data: featured = [] } = useSWR(
    `${apiUrl}/api/products/featured`,
    (url) => fetcher(url, token)
  );

  const filtered = (Array.isArray(products) ? products : []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        {['es', 'en'].map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded font-medium transition ${
              language === lang
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-blue-300 hover:bg-slate-600'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Hero Section */}
      <section className="text-white py-20 border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              🛒 Offmarket
            </h1>
            <p className="text-2xl text-blue-100 font-light mb-8">
              Smart Shopping, Smarter Savings
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10">
              Compare prices across all nearby stores in real-time, track your monthly savings, and unlock exclusive deals with our AI-powered assistant.
            </p>
            {!token && (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/register"
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105 text-lg"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-4 border-2 border-blue-400 text-blue-300 font-bold rounded-xl hover:bg-blue-900/20 transition text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm hover:border-blue-400/60 transition">
              <div className="text-4xl font-bold text-cyan-300 mb-2">{filtered.length}+</div>
              <div className="text-blue-100 font-medium">Products Available</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 rounded-xl p-6 text-center backdrop-blur-sm hover:border-emerald-400/60 transition">
              <div className="text-4xl font-bold text-emerald-300 mb-2">💰</div>
              <div className="text-blue-100 font-medium">Save Up To 40%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl p-6 text-center backdrop-blur-sm hover:border-orange-400/60 transition">
              <div className="text-4xl font-bold text-orange-300 mb-2">📍</div>
              <div className="text-blue-100 font-medium">Real-Time Location</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center backdrop-blur-sm hover:border-purple-400/60 transition">
              <div className="text-4xl font-bold text-purple-300 mb-2">🤖</div>
              <div className="text-blue-100 font-medium">AI Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-gradient-to-b from-blue-900/20 to-transparent py-8 border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex gap-3 items-center flex-wrap">
              <input
                type="text"
                placeholder="🔍 Search milk, eggs, vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-64 px-5 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition border border-blue-500/50"
              >
                <option value="retail">🛍️ Retail</option>
                <option value="wholesale">📦 Wholesale</option>
              </select>
            </div>
            
            {latitude && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-blue-300 font-medium">📍 Search Radius:</span>
                {[10, 25, 50, 100].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${ 
                      radius === r
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-white/5 text-blue-200 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Requester */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LocationRequester onLocationReceived={setUserLocation} />
      </section>

      {/* Nearby Stores */}
      {userLocation && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <NearbyStores userLocation={userLocation} />
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-2">⭐ Today's Best Deals</h2>
            <p className="text-blue-300">Hand-picked products trending in your area</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode={mode}
                token={token}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Available Products</h2>
          <p className="text-blue-300">{filtered.length} items available in your area</p>
        </div>
        
        {productsError ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl backdrop-blur-sm">
            ⚠️ Error loading products. Please try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-6 py-12 rounded-xl text-center backdrop-blur-sm">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium mb-4">
              {searchQuery ? 'No products match your search' : 'No products available'}
            </p>
            {!token && (
              <Link href="/register" className="text-blue-400 hover:text-cyan-300 font-semibold underline">
                Sign up to see nearby deals
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode={mode}
                token={token}
              />
            ))}
          </div>
        )}
      </section>

      {/* Improved Chatbot */}
      <ImprovedChatbot products={filtered} stores={[]} />
    </main>
  );
}
