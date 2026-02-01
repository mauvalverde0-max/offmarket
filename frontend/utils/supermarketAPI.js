// Simulación de APIs de supermercados argentinos
// En producción, conectaríamos con sus APIs reales

const SUPERMARKETS = {
  changomas: {
    name: 'Changomas',
    logo: '🛒',
    color: 'from-red-600 to-red-700',
    icon: '🔴'
  },
  disco: {
    name: 'Disco',
    logo: '💙',
    color: 'from-blue-600 to-blue-700',
    icon: '💙'
  },
  walmart: {
    name: 'Walmart',
    logo: '⭐',
    color: 'from-yellow-600 to-yellow-700',
    icon: '⭐'
  },
  carrefour: {
    name: 'Carrefour',
    logo: '🔷',
    color: 'from-blue-600 to-blue-800',
    icon: '🔷'
  },
  jumbo: {
    name: 'Jumbo',
    logo: '📦',
    color: 'from-green-600 to-green-700',
    icon: '📦'
  }
};

// Función para simular búsqueda de precios en supermercados
export const fetchSupermarketPrices = async (productName) => {
  // En producción, esto conectaría con APIs reales
  // Por ahora, generamos precios realistas simulados
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const basePrices = {
        'leche': { base: 250, variance: 50 },
        'pan': { base: 180, variance: 30 },
        'huevo': { base: 150, variance: 40 },
        'carne': { base: 800, variance: 150 },
        'verdura': { base: 100, variance: 50 },
        'arroz': { base: 200, variance: 60 },
        'aceite': { base: 600, variance: 100 },
        'azúcar': { base: 180, variance: 40 },
        'harina': { base: 150, variance: 35 },
        'fideos': { base: 120, variance: 30 },
      };

      const prices = {};
      const searchKey = productName.toLowerCase();
      const basePrice = basePrices[searchKey]?.base || 500;
      const variance = basePrices[searchKey]?.variance || 100;

      Object.keys(SUPERMARKETS).forEach((key) => {
        // Simular variación de precios por supermercado
        const variation = (Math.random() - 0.5) * variance;
        const discount = Math.random() > 0.6 ? Math.random() * 0.15 : 0; // 40% chance de descuento
        
        prices[key] = {
          name: SUPERMARKETS[key].name,
          price: Math.round(basePrice + variation),
          originalPrice: basePrice,
          discount: Math.round(discount * 100),
          available: Math.random() > 0.1, // 90% disponibilidad
          lastUpdate: new Date()
        };
      });

      // Ordenar por precio
      const sorted = Object.entries(prices)
        .sort((a, b) => a[1].price - b[1].price)
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

      resolve(sorted);
    }, 800);
  });
};

// Función para obtener detalles de un supermercado
export const getSupermarketInfo = (key) => {
  return SUPERMARKETS[key] || null;
};

// Obtener lista de supermercados
export const getSupermarketsList = () => {
  return SUPERMARKETS;
};

// Comparar precios y encontrar el más barato
export const findCheapest = (prices) => {
  const entries = Object.entries(prices).filter(([_, p]) => p.available);
  if (entries.length === 0) return null;
  
  return entries.reduce((min, [key, price]) => {
    const minPrice = min[1].price;
    const currentPrice = price.price;
    return currentPrice < minPrice ? [key, price] : min;
  });
};

// Calcular ahorro
export const calculateSavings = (prices) => {
  const entries = Object.entries(prices).filter(([_, p]) => p.available);
  if (entries.length < 2) return 0;
  
  const max = Math.max(...entries.map(([_, p]) => p.price));
  const min = Math.min(...entries.map(([_, p]) => p.price));
  
  return {
    savings: max - min,
    percentage: Math.round(((max - min) / max) * 100)
  };
};
