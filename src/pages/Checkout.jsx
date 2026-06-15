import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faPhone, faUser,
  faTruck, faCreditCard, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { createOrder, getCart } from '../services/api';

function Checkout({ cart, clearCartLocal }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [dbCart, setDbCart] = useState([]);

  const [shippingData, setShippingData] = useState({
    fullName: '', phone: '', address: '',
    city: '', country: 'Pakistan'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Backend se cart load karo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    getCart()
      .then(res => setDbCart(res.data.items || []))
      .catch(err => console.log(err));
  }, [navigate]);

  // Active cart
  const activeCart = dbCart.length > 0 ? dbCart : cart;

  const subtotal = activeCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!shippingData.fullName || !shippingData.phone ||
        !shippingData.address || !shippingData.city) {
      alert('Please fill all fields!');
      return;
    }

    if (activeCart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: activeCart.map(item => ({
          product: item.product || item._id || item.id || null,
          name: item.name,
          price: item.price,
          qty: item.qty,
          size: item.size,
          image: item.image,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        subtotal,
        shipping,
        discount: 0,
        total
      };

      console.log('Sending order:', orderData);
      const res = await createOrder(orderData);
      setOrderId(res.data.order._id);
      setOrderPlaced(true);
      if (clearCartLocal) clearCartLocal();
    } catch (err) {
      console.log('Order error:', err.response?.data || err);
      alert('Order failed! ' + (err.response?.data?.message || 'Please try again.'));
    }
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F0F2F5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: '#fff', borderRadius: 12,
          padding: '48px 40px', textAlign: 'center',
          maxWidth: 480, width: '100%',
          border: '1px solid #E0E0E0',
        }}>
          <FontAwesomeIcon icon={faCheckCircle}
            style={{ fontSize: 72, color: '#00A550', marginBottom: 20 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>
            Order Placed! 🎉
          </h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            Thank you for your order!
          </p>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 24 }}>
            Order ID: <strong>{orderId}</strong>
          </p>
          <button onClick={() => navigate('/')} style={{
            background: '#2B74D8', color: '#fff', border: 'none',
            padding: '13px 32px', borderRadius: 6,
            fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%',
          }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh', padding: '24px 40px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: '#1a1a1a' }}>
        Checkout
      </h1>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 6,
              background: step === i + 1 ? '#2B74D8' : step > i + 1 ? '#00A550' : '#E0E0E0',
              color: step >= i + 1 ? '#fff' : '#999',
              fontSize: 13, fontWeight: 600,
            }}>
              <span>{i + 1}</span><span>{s}</span>
            </div>
            {i < 2 && (
              <div style={{ width: 30, height: 2, background: step > i + 1 ? '#00A550' : '#E0E0E0' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

        {/* Left */}
        <div>
          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E0E0E0', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FontAwesomeIcon icon={faTruck} style={{ color: '#2B74D8' }} />
                Shipping Address
              </h2>
              {[
                { key: 'fullName', label: 'Full Name', icon: faUser, placeholder: 'Enter your full name' },
                { key: 'phone', label: 'Phone Number', icon: faPhone, placeholder: 'e.g. 03001234567' },
                { key: 'address', label: 'Street Address', icon: faMapMarkerAlt, placeholder: 'House #, Street, Area' },
                { key: 'city', label: 'City', icon: faMapMarkerAlt, placeholder: 'e.g. Karachi' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon icon={field.icon} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: '#999', fontSize: 13,
                    }} />
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={shippingData[field.key]}
                      onChange={e => setShippingData({ ...shippingData, [field.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '11px 14px 11px 36px',
                        border: '1px solid #E0E0E0', borderRadius: 6,
                        fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#2B74D8'}
                      onBlur={e => e.target.style.borderColor = '#E0E0E0'}
                    />
                  </div>
                </div>
              ))}
              <button onClick={() => setStep(2)} style={{
                width: '100%', background: '#2B74D8', color: '#fff',
                border: 'none', padding: '13px', borderRadius: 6,
                fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8,
              }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E0E0E0', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FontAwesomeIcon icon={faCreditCard} style={{ color: '#2B74D8' }} />
                Payment Method
              </h2>
              {[
                { value: 'COD', label: 'Cash on Delivery (COD)', sub: 'Pay when you receive your order', icon: '💵' },
                { value: 'Card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard accepted', icon: '💳' },
              ].map(pm => (
                <div key={pm.value} onClick={() => setPaymentMethod(pm.value)} style={{
                  border: `2px solid ${paymentMethod === pm.value ? '#2B74D8' : '#E0E0E0'}`,
                  borderRadius: 8, padding: '16px 20px', cursor: 'pointer', marginBottom: 12,
                  background: paymentMethod === pm.value ? '#EBF3FF' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${paymentMethod === pm.value ? '#2B74D8' : '#E0E0E0'}`,
                    background: paymentMethod === pm.value ? '#2B74D8' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {paymentMethod === pm.value && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{pm.label}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{pm.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 24 }}>{pm.icon}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, background: 'none', color: '#2B74D8',
                  border: '1px solid #2B74D8', padding: '13px',
                  borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}>← Back</button>
                <button onClick={() => setStep(3)} style={{
                  flex: 2, background: '#2B74D8', color: '#fff',
                  border: 'none', padding: '13px', borderRadius: 6,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}>Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E0E0E0', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Review Your Order</h2>

              <div style={{ background: '#F5F5F5', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#2B74D8' }}>📍 Shipping Address</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
                  <strong>{shippingData.fullName}</strong><br />
                  {shippingData.phone}<br />
                  {shippingData.address}, {shippingData.city}, {shippingData.country}
                </div>
              </div>

              <div style={{ background: '#F5F5F5', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#2B74D8' }}>💳 Payment Method</div>
                <div style={{ fontSize: 13, color: '#555' }}>
                  {paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Credit/Debit Card'}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#333' }}>🛒 Order Items</div>
                {activeCart.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 0', borderBottom: '1px solid #f0f0f0',
                  }}>
                    <img src={item.image} alt={item.name}
                      style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 4, background: '#f5f5f5' }}
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>Size: {item.size} × {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#FF3333', fontSize: 14 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={{
                  flex: 1, background: 'none', color: '#2B74D8',
                  border: '1px solid #2B74D8', padding: '13px',
                  borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}>← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} style={{
                  flex: 2, background: '#FF7D1A', color: '#fff',
                  border: 'none', padding: '13px', borderRadius: 6,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div style={{
          background: '#fff', borderRadius: 10,
          border: '1px solid #E0E0E0', padding: 24,
          height: 'fit-content',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</div>
          {activeCart.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '6px 0', fontSize: 13, color: '#555',
              borderBottom: '1px solid #f5f5f5',
            }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>${item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 14, color: '#666', borderTop: '1px solid #E0E0E0', marginTop: 8 }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#666', borderBottom: '1px solid #E0E0E0' }}>
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? '#00A550' : '#333' }}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 18, fontWeight: 800 }}>
            <span>Total</span>
            <span style={{ color: '#FF3333' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;