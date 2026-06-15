import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PRODUCTS from '../data/products';
import { getProduct } from '../services/api';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selSize, setSelSize] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then(res => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch(() => {
        const local = PRODUCTS.find(p =>
          p.id === parseInt(id) || p._id === id
        ) || PRODUCTS[0];
        setProduct(local);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontSize: 18, color: '#2B74D8' }}>
      Loading...
    </div>
  );

  if (!product) return null;

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh', padding: '24px 40px' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>
        <span style={{ cursor: 'pointer', color: '#2B74D8' }}
          onClick={() => navigate('/')}>Home</span>
        {' / '}
        <span style={{ cursor: 'pointer', color: '#2B74D8' }}
          onClick={() => navigate('/products')}>{product.category}</span>
        {' / '}
        <span style={{ color: '#333', fontWeight: 500 }}>{product.name}</span>
      </div>

      {/* Main Detail Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #E0E0E0',
        padding: 32,
        marginBottom: 32,
      }}>

        {/* LEFT - Images */}
        <div>
          <div style={{
            background: '#F5F5F5',
            borderRadius: 10,
            border: '1px solid #E0E0E0',
            height: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain', padding: 16,
              }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          </div>

          {/* Thumbnail Row */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: 65, height: 65,
                  background: '#F5F5F5',
                  borderRadius: 6,
                  border: `2px solid ${activeImg === i ? '#2B74D8' : '#E0E0E0'}`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                }}
              >
                <img
                  src={product.image}
                  alt={`thumb-${i}`}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain', padding: 4,
                  }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/65?text=img';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Info */}
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 800,
            marginBottom: 12, color: '#1a1a1a',
          }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 10, marginBottom: 14,
            paddingBottom: 14,
            borderBottom: '1px solid #E0E0E0',
          }}>
            <span style={{ color: '#FFAD33', fontSize: 16 }}>
              {'★'.repeat(product.rating || 0)}
              {'☆'.repeat(5 - (product.rating || 0))}
            </span>
            <span style={{ color: '#999', fontSize: 13 }}>
              ({product.reviews || 0} reviews)
            </span>
            <span style={{ color: '#00A550', fontSize: 13, fontWeight: 600 }}>
              ● In Stock
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#FF3333' }}>
              ${product.price}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: 16, color: '#999', textDecoration: 'line-through' }}>
                ${product.oldPrice}
              </span>
            )}
            {discount > 0 && (
              <span style={{
                background: '#FF3333', color: '#fff',
                fontSize: 11, fontWeight: 700,
                padding: '3px 8px', borderRadius: 3,
              }}>
                -{discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 20 }}>
            {product.description}
          </p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {product.colors.map((color, i) => (
                  <div key={i} style={{
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: color,
                    border: i === 0 ? '3px solid #2B74D8' : '2px solid #E0E0E0',
                    cursor: 'pointer',
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Size / Storage:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((size, i) => (
                  <button key={i} onClick={() => setSelSize(i)} style={{
                    padding: '6px 16px',
                    border: `1px solid ${selSize === i ? '#2B74D8' : '#E0E0E0'}`,
                    background: selSize === i ? '#2B74D8' : '#fff',
                    color: selSize === i ? '#fff' : '#333',
                    borderRadius: 5, fontSize: 13,
                    cursor: 'pointer', fontWeight: 500,
                  }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <div style={{
              display: 'flex', border: '1px solid #E0E0E0',
              borderRadius: 6, overflow: 'hidden',
            }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                width: 36, height: 40, border: 'none',
                background: '#f5f5f5', fontSize: 20,
                cursor: 'pointer', fontWeight: 700,
              }}>−</button>
              <span style={{
                width: 44, height: 40,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700,
                borderLeft: '1px solid #E0E0E0',
                borderRight: '1px solid #E0E0E0',
              }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{
                width: 36, height: 40, border: 'none',
                background: '#f5f5f5', fontSize: 20,
                cursor: 'pointer', fontWeight: 700,
              }}>+</button>
            </div>

            <button
              onClick={() => addToCart(product, qty, product.sizes ? product.sizes[selSize] : '')}
              style={{
                flex: 1, background: '#FF7D1A', color: '#fff',
                border: 'none', padding: '11px 0',
                borderRadius: 6, fontSize: 14,
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product, qty, product.sizes ? product.sizes[selSize] : '');
                navigate('/cart');
              }}
              style={{
                flex: 1, background: '#2B74D8', color: '#fff',
                border: 'none', padding: '11px 0',
                borderRadius: 6, fontSize: 14,
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Delivery Info */}
          <div style={{ background: '#F5F5F5', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: '1px solid #e0e0e0',
              fontSize: 13, color: '#555',
            }}>
              <span style={{ fontSize: 20 }}>🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <span style={{ color: '#999', marginLeft: 6 }}>on orders over $50</span>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', fontSize: 13, color: '#555',
            }}>
              <span style={{ fontSize: 20 }}>🔄</span>
              <div>
                <strong>Free 30-Day Returns</strong>
                <span style={{ color: '#999', marginLeft: 6 }}>hassle free returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 style={{
          fontSize: 20, fontWeight: 700,
          marginBottom: 16,
          borderBottom: '2px solid #2B74D8',
          paddingBottom: 10,
        }}>
          Related Products
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {PRODUCTS
            .filter(p => p.id !== product.id)
            .slice(0, 4)
            .map(p => (
              <div
                key={p._id || p.id}
                onClick={() => navigate(`/products/${p._id || p.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2B74D8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}
              >
                <div style={{
                  height: 160, background: '#F5F5F5',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden',
                }}>
                  <img src={p.image} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x160?text=No+Image';
                    }}
                  />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, marginBottom: 4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {p.name}
                  </div>
                  <div style={{ color: '#FF3333', fontWeight: 700, fontSize: 14 }}>
                    ${p.price}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;