/**
 * Página de Puntos de Lealtad
 * Muestra historial, puntos disponibles y opciones de canje
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PointsRedeemer from '@/components/PointsRedeemer';
import { getUserPoints, getPointsHistory, redeemPoints } from '@/utils/points';

export default function PointsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('userId') || 'guest_user';
    setUserId(id);
    setPoints(getUserPoints(id));
    setHistory(getPointsHistory(id));
  }, []);

  const handleRedeem = (reward) => {
    try {
      redeemPoints(userId, reward.points, `canje_${reward.id}`);
      setPoints(getUserPoints(userId));
      setHistory(getPointsHistory(userId));
      alert(`✓ ¡Recompensa canjeada! ${reward.name} ha sido añadido a tu cuenta.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Breadcrumb */}
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
            ← Volver al inicio
          </a>
        </Link>

        <h1 className="text-4xl font-bold mb-2">🎁 Puntos de Lealtad</h1>
        <p className="text-gray-400 mb-8">Acumula y canjea puntos en cada compra</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-8">
            {/* Redentor de puntos */}
            {userId && (
              <PointsRedeemer userId={userId} onRedeem={handleRedeem} />
            )}

            {/* Historial */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">📜 Historial de Puntos</h2>

              {history.length === 0 ? (
                <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-8 text-center">
                  <p className="text-gray-400 mb-4">Aún no tienes historial de puntos</p>
                  <Link href="/">
                    <a className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition">
                      Realiza tu primera compra
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...history].reverse().map((entry, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white capitalize">
                            {entry.amount > 0 ? '➕' : '➖'} {entry.reason.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {new Date(entry.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${entry.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.amount > 0 ? '+' : ''}{entry.amount}
                          </p>
                          <p className="text-sm text-gray-400">
                            Saldo: <span className="text-blue-300 font-semibold">{entry.balance}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Info sobre puntos */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="font-bold text-white mb-4">ℹ️ ¿Cómo funcionan?</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>✓ Gana 1 punto por cada $1 gastado</li>
                <li>✓ Canjea por descuentos y envíos gratis</li>
                <li>✓ Sin fecha de expiración</li>
                <li>✓ Acumula entre compras</li>
              </ul>
            </div>

            {/* Estadísticas */}
            <div className="space-y-3">
              <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Puntos ganados</p>
                <p className="text-3xl font-bold text-green-400">
                  {history.filter((h) => h.amount > 0).reduce((sum, h) => sum + h.amount, 0)}
                </p>
              </div>

              <div className="bg-slate-800 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Puntos canjeados</p>
                <p className="text-3xl font-bold text-red-400">
                  {Math.abs(history.filter((h) => h.amount < 0).reduce((sum, h) => sum + h.amount, 0))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Próximo nivel</p>
                <div className="mb-2">
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(points / 500) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {Math.max(0, 500 - points)} puntos para VIP
                  </p>
                </div>
              </div>
            </div>

            {/* Términos */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-xs text-gray-400">
              <p>Los puntos se acumulan automáticamente en cada compra. Las recompensas canjeadas se aplican a tu siguiente compra.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
