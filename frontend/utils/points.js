/**
 * Servicio de Puntos de Fidelidad
 * Gestiona puntos, recompensas y canjes
 */

const POINTS_STORAGE_KEY = 'offmarket_user_points';

export const getUserPoints = (userId) => {
  if (typeof window === 'undefined') return 0;
  const saved = localStorage.getItem(`${POINTS_STORAGE_KEY}_${userId}`);
  return saved ? parseInt(saved) : 0;
};

export const addPoints = (userId, amount, reason = 'compra') => {
  const current = getUserPoints(userId);
  const newPoints = current + amount;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${POINTS_STORAGE_KEY}_${userId}`, newPoints.toString());
    // Guardar historial
    const history = getPointsHistory(userId);
    history.push({
      date: new Date().toISOString(),
      amount,
      reason,
      balance: newPoints,
    });
    localStorage.setItem(`${POINTS_STORAGE_KEY}_${userId}_history`, JSON.stringify(history));
  }
  return newPoints;
};

export const redeemPoints = (userId, amount, reason = 'canje') => {
  const current = getUserPoints(userId);
  if (current < amount) {
    throw new Error('Puntos insuficientes');
  }
  
  const newPoints = current - amount;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${POINTS_STORAGE_KEY}_${userId}`, newPoints.toString());
    const history = getPointsHistory(userId);
    history.push({
      date: new Date().toISOString(),
      amount: -amount,
      reason,
      balance: newPoints,
    });
    localStorage.setItem(`${POINTS_STORAGE_KEY}_${userId}_history`, JSON.stringify(history));
  }
  return newPoints;
};

export const getPointsHistory = (userId) => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(`${POINTS_STORAGE_KEY}_${userId}_history`);
  return saved ? JSON.parse(saved) : [];
};

export const calculatePointsForPurchase = (amount) => {
  // 1 punto por cada dólar gastado
  return Math.floor(amount);
};

export const getRewardOptions = () => {
  return [
    { id: 1, name: 'Envío Gratis', points: 100, type: 'shipping' },
    { id: 2, name: 'Descuento 5%', points: 50, type: 'discount', discount: 0.05 },
    { id: 3, name: 'Descuento 10%', points: 100, type: 'discount', discount: 0.1 },
    { id: 4, name: 'Descuento 15%', points: 150, type: 'discount', discount: 0.15 },
    { id: 5, name: 'Envío + 5% desc', points: 150, type: 'combo' },
  ];
};
