import '@/styles/globals.css';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Load token from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <>
      <Header 
        user={user} 
        token={token} 
        onLogout={logout}
        onCartOpen={() => setIsCartOpen(true)}
      />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <Component 
        {...pageProps} 
        token={token} 
        user={user} 
        setToken={setToken} 
        setUser={setUser}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </>
  );
}
