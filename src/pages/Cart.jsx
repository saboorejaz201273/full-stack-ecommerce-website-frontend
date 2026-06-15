import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping, faArrowLeft, faTag,
  faTruck, faRotateLeft, faTrash
} from '@fortawesome/free-solid-svg-icons';
import {
  getCart as getCartAPI,
  updateCart as updateCartAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI
} from '../services/api';

function Cart({ cart, removeFromCart, updateQty }) {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [dbCart, setDbCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setLoading(true);
      getCartAPI()
        .then(res => {
          setDbCart(res.data.items);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token]);

  const activeCart = token && dbCart ? dbCart.map(item => ({
    key: item.key,
    _id: item.product,
    name: item.name,
    price: item.price,
    image: item.image,
    size: item.size,
    qty: item.qty,
  })) : cart;

  const subtotal = activeCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SAVE20') {
      setDiscount(Math.round(subtotal * 0.2));
      alert('✅ 20% discount applied!');
    } else {
      alert('❌ Invalid code. Try: SAVE20');
    }
  };

  const handleRemove = async (item) => {
    if (token) {
      try {
        const res = await removeFromCartAPI({
          productId: item._id,
          size: item.size
        });
        setDbCart(res.data.items);
      } catch (err) {
        console.log(err);
      }
    } else {
      removeFromCart(item.key);
    }
  };

  const handleQty = async (item, delta) => {
    const newQty = Math.max(1, item.qty + delta);
    if (token) {
      try {
        const res = await updateCartAPI({
          productId: item._id,
          size: item.size,
          qty: newQty
        });
        setDbCart(res.data.items);
      } catch (err) {
        console.log(err);
      }
    } else {
      updateQty(item.key, delta);
    }
  };

  const handleClearCart = async () => {
    if (token) {
      try {
        await clearCartAPI();
        setDbCart([]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', height: '50vh',
        fontSize: 18, color: '#2B74D8',
      }}>
        Loading cart...
      </div>
    );
  }

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh', padding: '24px 40px' }}>

      <h1 style={{
        fontSize: 24, fontWeight: 800, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10, color: '#1a1a1a',
      }}>
        <FontAwesomeIcon icon={faCartShopping} style={{ color: '#2B74D8' }} />
        Shopping Cart
        <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>
          ({activeCart.reduce((s, i) => s + i.qty, 0)} items)
        </span>
      </h1>

      {activeCart.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: '#fff', borderRadius: 10,
          border: '1px solid #E0E0E0',
        }}>
          <FontAwesomeIcon icon={faCartShopping}
            style={{ fontSize: 64, color: '#E0E0E0', marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: '#666', marginBottom: 20 }}>
            Your cart is empty!
          </p>
          <button onClick={() => navigate('/products')} style={{
            background: '#2B74D8', color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: 6,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: 16, padding: '10px 16px',
            background: '#fff', border: '1px solid #E0E0E0',
            borderRadius: 8, marginBottom: 8,
            fontSize: 13, fontWeight: 700, color: '#333',
          }}>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>

          {activeCart.map(item => (
            <div key={item.key} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: 16, alignItems: 'center',
              padding: '14px 16px',
              background: '#fff',
              border: '1px solid #E0E0E0',
              borderRadius: 8, marginBottom: 8,
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2B74D8'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 64, height: 64,
                  background: '#F5F5F5', borderRadius: 8,
                  border: '1px solid #E0E0E0',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
                }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=img';
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>Size: {item.size}</div>
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: 14 }}>${item.price}</div>

              <div style={{
                display: 'flex', border: '1px solid #E0E0E0',
                borderRadius: 6, overflow: 'hidden', width: 'fit-content',
              }}>
                <button onClick={() => handleQty(item, -1)} style={{
                  width: 32, height: 32, border: 'none',
                  background: '#f5f5f5', cursor: 'pointer', fontSize: 18, fontWeight: 700,
                }}>−</button>
                <span style={{
                  width: 40, textAlign: 'center', lineHeight: '32px',
                  fontWeight: 700, fontSize: 14,
                  borderLeft: '1px solid #E0E0E0', borderRight: '1px solid #E0E0E0',
                }}>
                  {item.qty}
                </span>
                <button onClick={() => handleQty(item, 1)} style={{
                  width: 32, height: 32, border: 'none',
                  background: '#f5f5f5', cursor: 'pointer', fontSize: 18, fontWeight: 700,
                }}>+</button>
              </div>

              <div style={{ fontWeight: 700, color: '#FF3333', fontSize: 15 }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>

              <button onClick={() => handleRemove(item)} style={{
                background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 16, color: '#999', padding: '4px 8px',
              }}
                onMouseEnter={e => { e.target.style.color = '#FF3333'; }}
                onMouseLeave={e => { e.target.style.color = '#999'; }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 24, marginTop: 20,
          }}>
            <div>
              <button onClick={() => navigate('/products')} style={{
                background: 'none', border: '1px solid #2B74D8',
                color: '#2B74D8', padding: '10px 20px',
                borderRadius: 6, cursor: 'pointer',
                fontWeight: 600, marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
              }}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Continue Shopping
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Coupon code — try SAVE20"
                  style={{
                    flex: 1, border: '1px solid #E0E0E0',
                    borderRadius: 6, padding: '10px 14px', fontSize: 13,
                  }}
                />
                <button onClick={applyCoupon} style={{
                  background: '#2B74D8', color: '#fff',
                  border: 'none', padding: '10px 20px',
                  borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <FontAwesomeIcon icon={faTag} /> Apply
                </button>
              </div>

              <div style={{
                marginTop: 20, background: '#fff',
                border: '1px solid #E0E0E0', borderRadius: 8, padding: 16,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13, color: '#555',
                }}>
                  <FontAwesomeIcon icon={faTruck} style={{ color: '#2B74D8' }} />
                  <span><strong>Free Delivery</strong> on orders over $50</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', fontSize: 13, color: '#555',
                }}>
                  <FontAwesomeIcon icon={faRotateLeft} style={{ color: '#00A550' }} />
                  <span><strong>Free 30-Day Returns</strong></span>
                </div>
              </div>
            </div>

            <div style={{
              background: '#fff', borderRadius: 10,
              border: '1px solid #E0E0E0', padding: 24,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Order Summary
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#666',
              }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid #f0f0f0',
                  fontSize: 14, color: '#00A550',
                }}>
                  <span>Discount (20%)</span>
                  <span style={{ fontWeight: 600 }}>-${discount}</span>
                </div>
              )}

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#666',
              }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: shipping === 0 ? '#00A550' : '#333' }}>
                  {shipping === 0 ? '🎉 FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '14px 0', fontSize: 18, fontWeight: 800,
              }}>
                <span>Total</span>
                <span style={{ color: '#FF3333' }}>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  if (!token) {
                    navigate('/login');
                  } else {
                    navigate('/checkout');
                  }
                }}
                style={{
                  width: '100%', background: '#FF7D1A', color: '#fff',
                  border: 'none', padding: '14px', borderRadius: 8,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4,
                }}
                onMouseEnter={e => e.target.style.background = '#e06500'}
                onMouseLeave={e => e.target.style.background = '#FF7D1A'}
              >
                {token ? 'Proceed to Checkout →' : 'Login to Checkout →'}
              </button>

              {token && (
                <button onClick={handleClearCart} style={{
                  width: '100%', background: 'none',
                  border: '1px solid #FF3333', color: '#FF3333',
                  padding: '10px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8,
                }}>
                  🗑 Clear Cart
                </button>
              )}

              <div style={{
                textAlign: 'center', marginTop: 12, fontSize: 12, color: '#999',
              }}>
                🔒 Secure Checkout · Visa · Mastercard · PayPal
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;