import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../services/api';

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }
    try {
      await addToWishlist({ productId: product._id || product.id });
      setWishlisted(true);
      setTimeout(() => setWishlisted(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E0E0E0',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .2s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2B74D8'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background:
            product.badge === 'new' ? '#00A550' :
            product.badge === 'hot' ? '#FF7D1A' : '#FF3333',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '3px 8px', borderRadius: 3, zIndex: 1,
        }}>
          {product.badge === 'sale' ? `-${discount}%` :
           product.badge === 'hot' ? '🔥 Hot' : 'New'}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: wishlisted ? '#FFECEC' : '#fff',
          border: `1px solid ${wishlisted ? '#FF3333' : '#E0E0E0'}`,
          borderRadius: '50%', width: 30, height: 30,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          fontSize: 14, zIndex: 1,
          transition: 'all 0.2s',
        }}
      >
        {wishlisted ? '❤️' : '🤍'}
      </button>

      {/* Product Image */}
      <div
        onClick={() => navigate(`/products/${product._id || product.id}`)}
        style={{
          height: 180,
          overflow: 'hidden',
          background: '#F5F5F5',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div style="font-size:48px">📦</div>';
          }}
        />
      </div>

      {/* Product Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          marginBottom: 4, lineHeight: 1.3,
          color: '#1C1C1C',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.name}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: 4,
        }}>
          <span style={{ color: '#FF3333', fontSize: 15, fontWeight: 700 }}>
            ${product.price}
          </span>
          {product.oldPrice && (
            <span style={{
              color: '#999', fontSize: 12,
              textDecoration: 'line-through',
            }}>
              ${product.oldPrice}
            </span>
          )}
        </div>

        {/* Stars */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#FFAD33', fontSize: 12 }}>
            {'★'.repeat(product.rating)}
            {'☆'.repeat(5 - product.rating)}
          </span>
          <span style={{ color: '#999', fontSize: 11, marginLeft: 4 }}>
            ({product.reviews})
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product, 1, product.sizes?.[0] || '')}
          style={{
            width: '100%',
            background: '#2B74D8',
            color: '#fff',
            border: 'none',
            padding: '9px 0',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#1a5bb5'}
          onMouseLeave={e => e.target.style.background = '#2B74D8'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;