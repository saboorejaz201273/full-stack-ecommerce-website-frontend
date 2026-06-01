import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMobileScreen, faLaptop, faHeadphones, faCamera,
  faClock, faGamepad, faShirt, faHouse, faWrench,
  faBars, faFire, faStar, faBolt, faTag,
  faArrowRight, faCartShopping, faHeart
} from '@fortawesome/free-solid-svg-icons';
import PRODUCTS from '../data/products';

const LeftBanner = ({ title, icon, iconColor, bg, btnBg, btnColor, imgSrc, onNavigate }) => (
  <div style={{
    width: 180, flexShrink: 0, background: bg, borderRadius: 10,
    padding: '20px 16px', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', border: '1px solid #E0E0E0', minHeight: 280,
  }}>
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <FontAwesomeIcon icon={icon} style={{ color: iconColor }} />
        {title}
      </h3>
      <button onClick={onNavigate} style={{
        background: btnBg, color: btnColor,
        border: btnBg === '#fff' ? '1px solid #ccc' : 'none',
        padding: '7px 14px', borderRadius: 4, fontSize: 12,
        cursor: 'pointer', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        Source Now <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 10 }} />
      </button>
    </div>
    <img src={imgSrc} alt={title}
      style={{ width: '100%', objectFit: 'contain', marginTop: 16, maxHeight: 140 }}
      onError={e => { e.target.style.display = 'none'; }}
    />
  </div>
);

const SmallCard = ({ product, onNavigate, onAddToCart }) => (
  <div
    onClick={() => onNavigate(product.id)}
    style={{
      background: '#fff', border: '1px solid #E0E0E0',
      borderRadius: 8, padding: '10px 8px',
      cursor: 'pointer', textAlign: 'center',
      transition: 'all 0.2s', position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#2B74D8';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(43,116,216,0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#E0E0E0';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    {product.badge && (
      <div style={{
        position: 'absolute', top: 5, left: 5,
        background: product.badge === 'new' ? '#00A550' :
          product.badge === 'hot' ? '#FF7D1A' : '#FF3333',
        color: '#fff', fontSize: 8, fontWeight: 700,
        padding: '2px 5px', borderRadius: 3,
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {product.badge === 'sale' ? (
          <><FontAwesomeIcon icon={faTag} style={{ fontSize: 7 }} />
            {` -${Math.round((1 - product.price / product.oldPrice) * 100)}%`}</>
        ) : product.badge === 'hot' ? (
          <><FontAwesomeIcon icon={faFire} style={{ fontSize: 7 }} /> HOT</>
        ) : (
          <><FontAwesomeIcon icon={faStar} style={{ fontSize: 7 }} /> NEW</>
        )}
      </div>
    )}
    <button onClick={e => e.stopPropagation()} style={{
      position: 'absolute', top: 5, right: 5,
      background: 'none', border: 'none',
      cursor: 'pointer', color: '#ccc', fontSize: 11, padding: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.color = '#FF3333'}
      onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
    <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
      <img src={product.image} alt={product.name}
        style={{ maxWidth: '100%', maxHeight: 90, objectFit: 'contain' }}
        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/90x90?text=img'; }}
      />
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#333', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {product.name}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <span style={{ color: '#FF3333', fontSize: 12, fontWeight: 700 }}>${product.price}</span>
      {product.oldPrice && (
        <span style={{ color: '#999', fontSize: 10, textDecoration: 'line-through' }}>${product.oldPrice}</span>
      )}
    </div>
    <div style={{ color: '#FFAD33', fontSize: 9, marginTop: 3 }}>
      {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
    </div>
    <button
      onClick={e => { e.stopPropagation(); onAddToCart(product, 1, product.sizes[0]); }}
      style={{
        width: '100%', background: '#2B74D8', color: '#fff',
        border: 'none', padding: '5px 0', fontSize: 10,
        fontWeight: 600, borderRadius: 4, cursor: 'pointer', marginTop: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}
    >
      <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: 9 }} />
      Add to Cart
    </button>
  </div>
);

function Home({ addToCart }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(3 * 3600 + 23 * 60 + 45);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');

  const CATS = [
    { icon: faMobileScreen, label: 'Phones & Tablets' },
    { icon: faLaptop, label: 'Computers & Laptops' },
    { icon: faHeadphones, label: 'Headphones' },
    { icon: faCamera, label: 'Cameras' },
    { icon: faClock, label: 'Smart Watches' },
    { icon: faGamepad, label: 'Gaming' },
    { icon: faShirt, label: 'Clothing & Fashion' },
    { icon: faHouse, label: 'Home & Garden' },
    { icon: faWrench, label: 'More Category' },
  ];

  const goProduct = (id) => navigate(`/products/${id}`);
  const goProducts = () => navigate('/products');

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ===== HERO ===== */}
      <div style={{
        display: 'grid', gridTemplateColumns: '220px 1fr 200px',
        minHeight: 360, background: '#fff', borderBottom: '1px solid #E0E0E0',
      }}>
        <div style={{ background: '#fff', borderRight: '1px solid #E0E0E0', padding: '8px 0' }}>
          <div style={{
            padding: '10px 16px', fontSize: 13, fontWeight: 700,
            color: '#333', borderBottom: '1px solid #E0E0E0',
            marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FontAwesomeIcon icon={faBars} style={{ color: '#2B74D8' }} />
            All Category
          </div>
          {CATS.map(cat => (
            <div key={cat.label} onClick={goProducts} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 16px', fontSize: 13, cursor: 'pointer',
              color: '#444', borderBottom: '1px solid #f8f8f8', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EBF3FF'; e.currentTarget.style.color = '#2B74D8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#444'; }}
            >
              <FontAwesomeIcon icon={cat.icon} style={{ width: 16 }} />
              <span>{cat.label}</span>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', background: '#7DD8C6' }}>
          <img src="/hero-banner.png" alt="hero" style={{
            position: 'absolute', right: 0, top: 0,
            width: '65%', height: '100%', objectFit: 'cover',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 0, width: '55%', height: '100%',
            background: 'linear-gradient(to right, #7DD8C6 70%, transparent)', zIndex: 1,
          }} />
          <div style={{
            position: 'relative', zIndex: 2, padding: '40px 36px',
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
              Latest Trending
            </p>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 20 }}>
              Electronic Items<br />
              <span style={{ color: '#fff' }}>Best Deals</span>
            </h1>
            <button onClick={goProducts} style={{
              background: '#fff', color: '#333', border: 'none',
              padding: '10px 28px', borderRadius: 4, fontSize: 14,
              fontWeight: 600, cursor: 'pointer', width: 'fit-content',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Learn More <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #E0E0E0' }}>
          <div style={{
            flex: 1, background: '#4267B2', padding: '18px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            borderBottom: '1px solid #365899', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, background: '#fff', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4267B2',
              }}>
                <FontAwesomeIcon icon={faFire} style={{ fontSize: 16 }} />
              </div>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Login with Facebook</span>
            </div>
            <button style={{
              background: '#fff', color: '#4267B2', border: 'none',
              padding: '8px 0', borderRadius: 4, fontSize: 12,
              fontWeight: 700, cursor: 'pointer', width: '100%',
            }}>Login</button>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 8, textAlign: 'center' }}>
              Don't have account?{' '}
              <span style={{ color: '#FFD700', cursor: 'pointer' }}>Register</span>
            </p>
          </div>
          <div style={{
            flex: 1, background: 'linear-gradient(135deg, #FF7D1A, #ff9a4a)',
            padding: '16px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', borderBottom: '1px solid #e06500', cursor: 'pointer',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FontAwesomeIcon icon={faFire} /> Hot Deals
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 6 }}>
              Get US $50 off<br />with a new seller
            </p>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Shop Now <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </div>
          <div style={{
            flex: 1, background: 'linear-gradient(135deg, #00BFA5, #26C6A6)',
            padding: '16px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', cursor: 'pointer',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FontAwesomeIcon icon={faStar} /> New Arrivals
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 6 }}>
              Get US $20 off<br />orders $200+
            </p>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Shop Now <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </div>
        </div>
      </div>

      {/* ===== DEALS + FEATURED PRODUCTS ===== */}
      <div style={{ padding: '20px 40px', display: 'flex', gap: 16 }}>

        {/* LEFT - Deals Timer */}
        <div style={{
          width: 160, flexShrink: 0,
          background: '#fff', border: '1px solid #E0E0E0',
          borderRadius: 10, padding: '20px 16px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          // Key: top padding pushes timer down to align with first product card
          paddingTop: 58,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <FontAwesomeIcon icon={faBolt} style={{ color: '#FF3333', fontSize: 16 }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
              Deals and offers
            </h3>
          </div>
          <p style={{ fontSize: 11, color: '#999', marginBottom: 16, textAlign: 'center' }}>
            Hygiene equipments
          </p>

          {/* Grey Countdown Boxes */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { val: h, label: 'Hour' },
              { val: m, label: 'Min' },
              { val: s, label: 'Sec' },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#606060', color: '#fff',
                  width: 40, height: 40, borderRadius: 6,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 17, fontWeight: 800,
                }}>
                  {t.val}
                </div>
                <div style={{ fontSize: 9, color: '#999', marginTop: 4 }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Products */}
        <div style={{ flex: 1 }}>
          {/* Section Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 12,
            borderBottom: '2px solid #2B74D8', paddingBottom: 8,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FontAwesomeIcon icon={faFire} style={{ color: '#FF7D1A' }} />
              Featured Products
            </h2>
            <button onClick={goProducts} style={{
              background: 'none', border: '1px solid #2B74D8',
              color: '#2B74D8', padding: '5px 14px', borderRadius: 4,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              View All <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
            </button>
          </div>

          {/* 5 col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {PRODUCTS.slice(0, 10).map(product => (
              <SmallCard
                key={product.id}
                product={product}
                onNavigate={goProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOME & OUTDOOR ===== */}
      <div style={{ padding: '0 40px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <LeftBanner
          title="Home and outdoor"
          icon={faHouse} iconColor="#8B6914"
          bg="linear-gradient(160deg, #f5f0e8, #ede0c8)"
          btnBg="#fff" btnColor="#333"
          imgSrc="/images/products/plant.png"
          onNavigate={goProducts}
        />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {PRODUCTS.filter(p => p.category === 'Home' || p.category === 'Furniture')
            .slice(0, 8).map(product => (
              <SmallCard key={product.id} product={product} onNavigate={goProduct} onAddToCart={addToCart} />
            ))}
        </div>
      </div>

      {/* ===== ELECTRONICS ===== */}
      <div style={{ padding: '0 40px 40px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <LeftBanner
          title="Consumer electronics"
          icon={faLaptop} iconColor="#1565C0"
          bg="linear-gradient(160deg, #E3F2FD, #BBDEFB)"
          btnBg="#2B74D8" btnColor="#fff"
          imgSrc="/images/products/electronics.jpg"
          onNavigate={goProducts}
        />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {PRODUCTS.filter(p =>
            p.category === 'Phones' || p.category === 'Laptops' ||
            p.category === 'Headphones' || p.category === 'Cameras' ||
            p.category === 'Watches'
          ).slice(0, 8).map(product => (
            <SmallCard key={product.id} product={product} onNavigate={goProduct} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

    </div>
  );
}
export default Home;