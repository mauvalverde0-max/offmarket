/**
 * Página de Checkout
 * Flujo de compra multi-paso con opciones de pago simuladas
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCart, getCartTotal, clearCart, getCartByStore } from '@/utils/cart';
import { addPoints } from '@/utils/points';

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Review, 2: Address, 3: Payment, 4: Confirmation
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/');
      return;
    }
    setCart(cartItems);
    setTotal(getCartTotal());
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 2) {
      return formData.address && formData.city && formData.zipCode && formData.phone;
    }
    if (stepNum === 3) {
      if (formData.paymentMethod === 'card') {
        return formData.cardNumber && formData.cardExpiry && formData.cardCVC;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (!validateStep(step)) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (step === 3) {
      // Simular procesamiento de pago
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generar orden
      const id = `ORD-${Date.now()}`;
      setOrderId(id);
      
      // Agregar puntos de lealtad
      const userId = localStorage.getItem('userId') || 'user_' + Date.now();
      const points = Math.floor(total);
      addPoints(userId, points, 'compra');
      
      // Limpiar carrito
      clearCart();
      setStep(4);
      setLoading(false);
    } else {
      setStep(step + 1);
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
        <div className="max-w-2xl mx-auto py-20 text-center">
          <p className="text-xl text-gray-400 mb-4">Cargando...</p>
        </div>
      </div>
    );
  }

  const cartByStore = getCartByStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold mb-2">🛒 Checkout</h1>
          <p className="text-gray-400">Paso {step} de 4</p>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  s === step
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition ${
                    s < step ? 'bg-green-600' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="md:col-span-2">
            {/* Paso 1: Revisión del carrito */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300">📦 Revisión del Carrito</h2>

                  {Object.entries(cartByStore).map(([storeId, storeData]) => (
                    <div key={storeId} className="mb-6 last:mb-0">
                      <h3 className="font-bold text-white mb-4 pb-2 border-b border-blue-500/30">
                        🏪 {storeData.storeName}
                      </h3>

                      <div className="space-y-3">
                        {storeData.items.map((item) => (
                          <div
                            key={`${item.id}-${item.storeId}`}
                            className="flex justify-between items-center p-3 bg-slate-700/50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.image}</span>
                              <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">
                                  {item.quantity} × ${item.price}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold text-blue-300">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-blue-500/20 text-right">
                        <p className="text-gray-300">
                          Subtotal tienda: <span className="font-bold text-blue-300">${storeData.total.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition"
                >
                  Continuar a dirección
                </button>
              </div>
            )}

            {/* Paso 2: Dirección de entrega */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300">📍 Dirección de Entrega</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Calle Principal 123"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleFormChange}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Nueva York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleFormChange}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="555-0123"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-white font-bold transition"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition"
                  >
                    Continuar a pago
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Método de pago */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-blue-300">💳 Método de Pago</h2>

                  <div className="space-y-4 mb-6">
                    <label className="flex items-center p-4 border-2 border-blue-600 rounded-lg cursor-pointer bg-blue-600/20">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleFormChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-white">💳 Tarjeta de Crédito/Débito</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleFormChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-white">🅿️ PayPal</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-slate-500">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleFormChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-white">🏦 Transferencia Bancaria</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Número de Tarjeta *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleFormChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Vencimiento (MM/YY) *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleFormChange}
                            placeholder="12/25"
                            maxLength="5"
                            className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            CVC *
                          </label>
                          <input
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleFormChange}
                            placeholder="123"
                            maxLength="3"
                            className="w-full bg-slate-600 border border-slate-500 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-yellow-300 mt-3">
                        ℹ️ Usa números de prueba (ej: 4242 4242 4242 4242) - Sistema de demostración
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-white font-bold transition"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-lg text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span> Procesando...
                      </>
                    ) : (
                      <>Completar Compra</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Paso 4: Confirmación */}
            {step === 4 && orderId && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-8">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-3xl font-bold text-white mb-2">¡Compra Completada!</h2>
                  <p className="text-gray-300 mb-4">Tu pedido ha sido procesado exitosamente</p>

                  <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-gray-400 mb-1">Número de orden</p>
                    <p className="text-2xl font-bold text-blue-300 break-all">{orderId}</p>
                  </div>

                  <div className="space-y-2 text-left mb-6">
                    <div className="flex justify-between py-2 border-b border-slate-700">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700">
                      <span className="text-gray-300">Puntos ganados</span>
                      <span className="text-green-400 font-semibold">+{Math.floor(total)} pts</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-blue-300 font-bold text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-6">
                    Se envió un correo de confirmación a {formData.email}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/dashboard" className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg text-white font-bold transition">
                    Ver mis compras
                  </Link>
                  <Link href="/" className="block bg-slate-700 hover:bg-slate-600 py-3 rounded-lg text-white font-bold transition">
                    Volver al inicio
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resumen lateral */}
          <div className="md:col-span-1">
            <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-6 sticky top-8 space-y-4">
              <h3 className="font-bold text-white text-lg">📋 Resumen</h3>

              <div className="space-y-2 pb-4 border-b border-slate-700 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.storeId}`} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="text-white font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-700">
                  <span className="text-white">Total</span>
                  <span className="text-blue-300">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
