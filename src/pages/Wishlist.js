import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/api';

function Wishlist({ addToCart }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getWishlist()
        .then(res => {
          setWishlist(res.data.products || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromWishlist({ productId });
      setWishlist(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: '50vh',
      fontSize: 18, color: '#2B74D8',
    }}>
      Loading wishlist...
    </div>
  );

  if (!token) return (
    <div style={{
      textAlign: 'center', padding: '80px 0',
      background: '#F0F2F5', minHeight: '100vh',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 20 }}>
        Please login to see your wishlist
      </p>
      <button onClick={() => navigate('/login')} style={{
        background: '#2B74D8', color: '#fff',
        border: 'none', padding: '12px 28px',
        borderRadius: 6, fontSize: 15,
        fontWeight: 700, cursor: 'pointer',
      }}>
        Login
      </button>
    </div>
  );

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh', padding: '24px 40px' }}>
      <h1 style={{
        fontSize: 24, fontWeight: 800, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10, color: '#1a1a1a',
      }}>
        🤍 My Wishlist
        <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>
          ({wishlist.length} items)
        </span>
      </h1>

      {wishlist.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: '#fff', borderRadius: 10,
          border: '1px solid #E0E0E0',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 20 }}>
            Your wishlist is empty!
          </p>
          <button onClick={() => navigate('/products')} style={{
            background: '#2B74D8', color: '#fff',
            border: 'none', padding: '12px 28px',
            borderRadius: 6, fontSize: 15,
            fontWeight: 700, cursor: 'pointer',
          }}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {wishlist.map(product => (
            <div key={product._id} style={{
              background: '#fff',
              border: '1px solid #E0E0E0',
              borderRadius: 10,
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product._id)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: '#fff', border: '1px solid #E0E0E0',
                  borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                  fontSize: 16, zIndex: 1, color: '#FF3333',
                }}
              >
                ✕
              </button>

              {/* Image */}
              <div
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  height: 180, background: '#F5F5F5',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, marginBottom: 6,
                  color: '#1a1a1a', cursor: 'pointer',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: '#FF3333', fontWeight: 700, fontSize: 16 }}>
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span style={{ color: '#999', fontSize: 13, textDecoration: 'line-through' }}>
                      ${product.oldPrice}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1, product.sizes?.[0] || '');
                    handleRemove(product._id);
                  }}
                  style={{
                    width: '100%', background: '#2B74D8', color: '#fff',
                    border: 'none', padding: '10px', borderRadius: 6,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;