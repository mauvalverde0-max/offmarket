/**
 * Página de Gestión de Productos para Locales (Admin)
 * Permite que dueños de tiendas suban y gestionen productos
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LocalProductsManage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    bulkPrice: '',
    category: 'grocery',
    description: '',
    image: '📦',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar productos del localStorage (simulado)
    const saved = localStorage.getItem('local_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        bulkPrice: parseFloat(formData.bulkPrice),
        createdAt: new Date().toISOString(),
      };

      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem('local_products', JSON.stringify(updated));

      // Reset form
      setFormData({
        name: '',
        price: '',
        bulkPrice: '',
        category: 'grocery',
        description: '',
        image: '📦',
      });
      setShowForm(false);
      setLoading(false);

      alert('✓ Producto agregado exitosamente');
    }, 500);
  };

  const handleDeleteProduct = (id) => {
    if (!confirm('¿Confirmar eliminación?')) return;

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('local_products', JSON.stringify(updated));
  };

  const categoryEmojis = {
    grocery: '🥫',
    dairy: '🥛',
    produce: '🥕',
    bakery: '🍞',
    meat: '🥩',
    frozen: '🧊',
    beverages: '🥤',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold mb-2">🏪 Gestor de Productos</h1>
          <p className="text-gray-400">Administra tu catálogo de productos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-1">
            <div className={`bg-slate-800 border border-blue-500/30 rounded-lg p-6 sticky top-8 ${showForm ? '' : 'opacity-50'}`}>
              <h2 className="text-xl font-bold mb-6 text-blue-300">
                {showForm ? '➕ Nuevo Producto' : '📝 Agregar Producto'}
              </h2>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition"
                >
                  Agregar Producto
                </button>
              ) : (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Leche Fresca"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Precio Unitario *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        step="0.01"
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="2.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Precio Mayorista
                      </label>
                      <input
                        type="number"
                        name="bulkPrice"
                        value={formData.bulkPrice}
                        onChange={handleFormChange}
                        step="0.01"
                        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="2.49"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="grocery">🥫 Despensa</option>
                      <option value="dairy">🥛 Lácteos</option>
                      <option value="produce">🥕 Verduras</option>
                      <option value="bakery">🍞 Panadería</option>
                      <option value="meat">🥩 Carnes</option>
                      <option value="frozen">🧊 Congelados</option>
                      <option value="beverages">🥤 Bebidas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Emoji del Producto
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      maxLength="2"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-2xl text-white focus:border-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Describe tu producto..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white font-bold transition disabled:opacity-50"
                    >
                      {loading ? '⏳ Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-white font-bold transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Lista de productos */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-white">
              📦 Tus Productos ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">Aún no has agregado productos</p>
                <p className="text-sm text-gray-500">Haz clic en "Agregar Producto" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-800 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{product.image}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{product.description}</p>

                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="bg-blue-600/40 px-2 py-1 rounded text-xs font-semibold text-blue-300">
                              {categoryEmojis[product.category]} {product.category}
                            </span>

                            <div className="text-sm">
                              <span className="text-gray-400">Precio: </span>
                              <span className="font-bold text-white">${product.price}</span>
                            </div>

                            {product.bulkPrice && (
                              <div className="text-sm">
                                <span className="text-gray-400">Mayorista: </span>
                                <span className="font-bold text-green-400">${product.bulkPrice}</span>
                              </div>
                            )}

                            <div className="text-xs text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 text-xl ml-4"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
