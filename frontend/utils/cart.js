/**
 * Servicio de Carrito de Compras
 * Gestiona el carrito local y operaciones de compra
 */

const CART_STORAGE_KEY = 'offmarket_cart';
const CART_VERSION = 1;

export const getCart = () => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) return [];
  const parsed = JSON.parse(saved);
  return parsed.items || [];
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id && item.storeId === product.storeId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      storeId: product.storeId,
      storeName: product.storeName,
      quantity,
      image: product.image || '📦',
    });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId, storeId) => {
  const cart = getCart().filter((item) => !(item.id === productId && item.storeId === storeId));
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (productId, storeId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(productId, storeId);
  }

  const cart = getCart();
  const item = cart.find((item) => item.id === productId && item.storeId === storeId);
  if (item) {
    item.quantity = quantity;
  }
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
};

export const getCartTotal = () => {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const getCartItemCount = () => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

const saveCart = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: CART_VERSION, items: cart }));
  }
};

export const getCartByStore = () => {
  const cart = getCart();
  const byStore = {};
  cart.forEach((item) => {
    if (!byStore[item.storeId]) {
      byStore[item.storeId] = { storeName: item.storeName, items: [], total: 0 };
    }
    byStore[item.storeId].items.push(item);
    byStore[item.storeId].total += item.price * item.quantity;
  });
  return byStore;
};
