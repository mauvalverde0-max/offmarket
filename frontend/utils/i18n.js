// Simple i18n system for Spanish/English
const translations = {
  es: {
    // Navigation
    'alerts': 'Alertas',
    'points': 'Puntos',
    'ai': 'IA',
    'dashboard': 'Dashboard',
    'cart': 'Carrito',
    'my_products': 'Mis Productos',
    'login': 'Ingresar',
    'register': 'Registrarse',
    'logout': 'Salir',
    
    // Homepage
    'welcome': 'Bienvenido a OffMarket',
    'find_best_deals': 'Encuentra los mejores descuentos en tu área',
    'todays_best_deals': 'Los Mejores Descuentos de Hoy',
    'hand_picked': 'Productos seleccionados tendencia en tu área',
    'available_products': 'Productos Disponibles',
    'items_available': 'artículos disponibles en tu área',
    'sign_up_see_deals': 'Regístrate para ver ofertas cercanas',
    'no_products': 'No hay productos disponibles',
    'search': 'Buscar',
    'nearby_stores': 'Locales Cercanos',
    'enable_location': 'Habilitar Ubicación',
    
    // Product detail
    'price': 'Precio',
    'store': 'Local',
    'rating': 'Calificación',
    'add_to_cart': 'Agregar al Carrito',
    'buy_now': 'Comprar Ahora',
    'set_price_alert': 'Establecer Alerta de Precio',
    'free_shipping': 'Envío gratis para órdenes mayores a $50',
    'in_stock': 'En stock',
    'out_of_stock': 'Agotado',
    
    // Cart
    'your_cart_empty': 'Tu carrito está vacío',
    'continue_shopping': 'Seguir comprando',
    'cart_total': 'Total del carrito',
    'checkout': 'Proceder al Pago',
    'remove': 'Eliminar',
    'quantity': 'Cantidad',
    
    // Chatbot
    'ask_me': 'Pregúntame sobre productos, locales, ofertas y más',
    'send': 'Enviar',
    'looking_for': 'Estoy buscando',
    'nearby_stores_for': 'Locales cercanos para',
    'best_price': 'Mejor precio para',
    'show_me_stores': 'Muéstrame locales cerca',
    'help': 'Ayuda',
    
    // Geolocation
    'enable_location_msg': 'Habilita tu ubicación para ver ofertas cercanas',
    'location_enabled': 'Ubicación habilitada',
    'location_disabled': 'Ubicación deshabilitada',
    'km_away': 'km de distancia',
  },
  
  en: {
    // Navigation
    'alerts': 'Alerts',
    'points': 'Points',
    'ai': 'AI',
    'dashboard': 'Dashboard',
    'cart': 'Cart',
    'my_products': 'My Products',
    'login': 'Login',
    'register': 'Sign Up',
    'logout': 'Logout',
    
    // Homepage
    'welcome': 'Welcome to OffMarket',
    'find_best_deals': 'Find the best deals in your area',
    'todays_best_deals': 'Today\'s Best Deals',
    'hand_picked': 'Hand-picked products trending in your area',
    'available_products': 'Available Products',
    'items_available': 'items available in your area',
    'sign_up_see_deals': 'Sign up to see nearby deals',
    'no_products': 'No products available',
    'search': 'Search',
    'nearby_stores': 'Nearby Stores',
    'enable_location': 'Enable Location',
    
    // Product detail
    'price': 'Price',
    'store': 'Store',
    'rating': 'Rating',
    'add_to_cart': 'Add to Cart',
    'buy_now': 'Buy Now',
    'set_price_alert': 'Set Price Alert',
    'free_shipping': 'Free shipping for orders over $50',
    'in_stock': 'In stock',
    'out_of_stock': 'Out of stock',
    
    // Cart
    'your_cart_empty': 'Your cart is empty',
    'continue_shopping': 'Continue shopping',
    'cart_total': 'Cart total',
    'checkout': 'Proceed to Payment',
    'remove': 'Remove',
    'quantity': 'Quantity',
    
    // Chatbot
    'ask_me': 'Ask me about products, stores, deals and more',
    'send': 'Send',
    'looking_for': 'I\'m looking for',
    'nearby_stores_for': 'Nearby stores for',
    'best_price': 'Best price for',
    'show_me_stores': 'Show me stores nearby',
    'help': 'Help',
    
    // Geolocation
    'enable_location_msg': 'Enable your location to see nearby deals',
    'location_enabled': 'Location enabled',
    'location_disabled': 'Location disabled',
    'km_away': 'km away',
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = typeof window !== 'undefined' 
    ? [
        localStorage.getItem('language') || 'es',
        (lang) => {
          localStorage.setItem('language', lang);
          window.location.reload();
        }
      ]
    : ['es', () => {}];
  
  const t = (key) => translations[language][key] || key;
  
  return { language, setLanguage, t };
};

export default translations;
