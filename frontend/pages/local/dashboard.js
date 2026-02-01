/**
 * Panel de Control para Dueños de Tiendas (Locales)
 * Gestión de productos, ventas y estadísticas
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LocalDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Cargar datos de localStorage (simulado)
    const savedProducts = localStorage.getItem('local_products');
    if (savedProducts) {
      const prods = JSON.parse(savedProducts);
      setProducts(prods);
      
      // Calcular estadísticas simuladas
      setStats({
        totalProducts: prods.length,
        totalSales: Math.floor(Math.random() * 5000) + 500,
        averageRating: (Math.random() * 2 + 3.5).toFixed(1),
        totalReviews: Math.floor(Math.random() * 200) + 10,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">🏪 Panel de Control de Tienda</h1>
          <p className="text-gray-400 text-lg">Gestiona tu negocio en OffMarket</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/60 transition">
            <p className="text-gray-400 text-sm mb-2">📦 Productos</p>
            <p className="text-4xl font-bold text-blue-300">{stats.totalProducts}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition">
            <p className="text-gray-400 text-sm mb-2">💰 Ventas Totales</p>
            <p className="text-4xl font-bold text-green-300">${stats.totalSales}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500/60 transition">
            <p className="text-gray-400 text-sm mb-2">⭐ Calificación</p>
            <p className="text-4xl font-bold text-yellow-300">{stats.averageRating}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition">
            <p className="text-gray-400 text-sm mb-2">💬 Reseñas</p>
            <p className="text-4xl font-bold text-purple-300">{stats.totalReviews}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/local/products/manage" className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-6 rounded-lg transition text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold text-lg mb-1">Gestionar Productos</h3>
            <p className="text-sm text-blue-100">Agregar, editar o eliminar productos</p>
          </Link>

          <a href="#" className="block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 p-6 rounded-lg transition text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg mb-1">Análisis de Ventas</h3>
            <p className="text-sm text-emerald-100">Ver reportes y tendencias</p>
          </a>

          <a href="#" className="block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 p-6 rounded-lg transition text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-bold text-lg mb-1">Configuración</h3>
            <p className="text-sm text-purple-100">Datos de tu tienda y políticas</p>
          </a>
        </div>

        {/* Productos recientes */}
        <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">📦 Tus Últimos Productos</h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No tienes productos aún</p>
              <Link href="/local/products/manage" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">
                Agregar Producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="bg-slate-700 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">{product.image}</div>
                  <h3 className="font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Precio</p>
                      <p className="font-bold text-blue-300">${product.price}</p>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            💡 Consejos para Vender Más
          </h3>
          <ul className="space-y-2 text-sm text-yellow-100">
            <li>✓ Mantén tus productos siempre actualizados con precios competitivos</li>
            <li>✓ Responde rápido a los clientes y resuelve problemas</li>
            <li>✓ Ofrece promociones periódicas para atraer más compradores</li>
            <li>✓ Describe bien tus productos con detalles útiles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
