/**
 * Componente de Redentor de Puntos
 * Permite canjear puntos de lealtad por recompensas
 */

import { useState, useEffect } from 'react';
import { getUserPoints, getRewardOptions } from '@/utils/points';

export default function PointsRedeemer({ userId, onRedeem }) {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setPoints(getUserPoints(userId));
    setRewards(getRewardOptions());
  }, [userId]);

  const handleSelectReward = (reward) => {
    if (points >= reward.points) {
      setSelectedReward(reward);
      setShowConfirm(true);
    }
  };

  const handleConfirmRedeem = () => {
    if (selectedReward && onRedeem) {
      onRedeem(selectedReward);
    }
    setShowConfirm(false);
    setSelectedReward(null);
  };

  return (
    <div className="space-y-6">
      {/* Puntos actuales */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300 text-sm mb-2">Puntos disponibles</p>
        <div className="flex items-baseline justify-between">
          <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text">
            {points}
          </h2>
          <p className="text-gray-400 text-sm">1 punto = $1 gastado</p>
        </div>
      </div>

      {/* Recompensas */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">🎁 Recompensas disponibles</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rewards.map((reward) => {
            const canRedeem = points >= reward.points;
            return (
              <div
                key={reward.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  canRedeem
                    ? 'bg-slate-800 border-blue-500/30 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20'
                    : 'bg-slate-800/50 border-gray-600/30 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => canRedeem && handleSelectReward(reward)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{reward.name}</h4>
                  <span className="bg-blue-600/40 px-2 py-1 rounded text-xs font-bold text-blue-300">
                    {reward.points} pts
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-3">
                  {reward.type === 'shipping'
                    ? '📦 Envío gratis'
                    : reward.type === 'discount'
                    ? `💰 ${(reward.discount * 100).toFixed(0)}% descuento`
                    : reward.type === 'combo'
                    ? '📦 + 💰 Combo especial'
                    : 'Recompensa especial'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {canRedeem ? (
                      <span className="text-green-400">✓ Disponible</span>
                    ) : (
                      <span className="text-red-400">
                        Te faltan {reward.points - points} puntos
                      </span>
                    )}
                  </div>
                  {canRedeem && (
                    <span className="text-blue-400 font-semibold">→ Canjear</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">¿Confirmar canje?</h3>

            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-2">{selectedReward.name}</p>
              <p className="text-2xl font-bold text-blue-300 mb-3">
                {selectedReward.points} puntos
              </p>
              <div className="bg-slate-700/50 rounded p-3 text-sm text-gray-300">
                <p className="mb-1">Después del canje tendrás:</p>
                <p className="font-bold text-blue-300">{points - selectedReward.points} puntos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-white font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-2 rounded-lg text-white font-bold transition"
              >
                Canjear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
