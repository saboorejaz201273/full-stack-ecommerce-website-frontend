import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import { addToCart as addToCartAPI } from './services/api';

function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addToCart = async (product, qty = 1, size = '') => {
    const key = `${product._id || product.id}-${size}`;
    const token = localStorage.getItem('token');

    setCart(prev => {
      const exists = prev.find(i => i.key === key);
      if (exists) {
        return prev.map(i =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty, size, key }];
    });

    if (token) {
      try {
        await addToCartAPI({
          productId: product._id || product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty,
          size: size || (product.sizes ? product.sizes[0] : ''),
          key
        });
      } catch (err) {
        console.log('❌ Cart API error:', err);
      }
    }

    showToast('Added to cart!');
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(i => i.key !== key));
  };

  const updateQty = (key, delta) => {
    setCart(prev =>
      prev.map(i =>
        i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/cart" element={
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQty={updateQty}
          />
        } />
         <Route path="/checkout" element={
  <Checkout cart={cart} clearCartLocal={() => setCart([])} />
} />
        <Route path="/wishlist" element={<Wishlist addToCart={addToCart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
      <Footer />
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#2B74D8', color: '#fff',
          padding: '12px 20px', borderRadius: 8,
          fontSize: 14, fontWeight: 600, zIndex: 999,
        }}>
          ✓ {toast}
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;