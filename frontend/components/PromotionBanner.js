/**
 * Componente de Banner de Promociones
 * Muestra promociones activas por geolocalización
 */

import { useState, useEffect } from 'react';
import { mockPromotions } from '@/utils/mockData';

export default function PromotionBanner() {
  const [activePromotion, setActivePromotion] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (mockPromotions.length > 0) {
      setActivePromotion(mockPromotions[Math.floor(Math.random() * mockPromotions.length)]);
    }

    // Cambiar promoción cada 10 segundos
    const interval = setInterval(() => {
      if (mockPromotions.length > 0) {
        setActivePromotion(mockPromotions[Math.floor(Math.random() * mockPromotions.length)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !activePromotion) return null;

  const daysLeft = Math.ceil(
    (new Date(activePromotion.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const discountText =
    activePromotion.discount > 0
      ? `${(activePromotion.discount * 100).toFixed(0)}% OFF`
      : activePromotion.freeShipping
      ? 'ENVÍO GRATIS'
      : 'ESPECIAL';

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl animate-bounce">🎉</span>
          <div>
            <p className="font-bold text-amber-300 text-sm md:text-base">
              {activePromotion.title}
            </p>
            <p className="text-xs text-amber-200/70">
              {activePromotion.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <div className="hidden md:block text-right">
            <p className="font-bold text-amber-300">{discountText}</p>
            <p className="text-xs text-amber-200/70">
              {daysLeft > 0 ? `Vence en ${daysLeft} días` : 'Vence hoy'}
            </p>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="text-amber-300 hover:text-amber-200 text-xl"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
