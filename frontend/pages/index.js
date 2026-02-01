import useSWR from 'swr';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const fetcher = (url, token) =>
  fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());

export default function Home({ token }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('retail'); // retail or wholesale
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-start gap-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Offmarket</h1>
              <p className="text-lg text-gray-600">
                Compare prices across stores and track your savings
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {filtered.length}
              </div>
              <div className="text-sm text-gray-600">products available</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 space-y-4">
            <div className="flex gap-4 items-center flex-wrap">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
              >
                <option value="retail">Retail Pricing</option>
                <option value="wholesale">Wholesale Mode</option>
              </select>
              {latitude && (
                <div className="text-sm text-gray-600">
                  Showing stores within {radius}km
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    radius === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products of the Day</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 3).map((product) => (
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>
        {productsError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            Error loading products. Please try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-lg text-center">
            {searchQuery
              ? 'No products match your search'
              : 'No products available'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </main>
  );
}
