import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping, faUser, faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar({ cartCount, user, logout })  {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <>
      {/* Top Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E0E0E0',
        padding: '8px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#333',
      }}>
        <span>Free shipping on orders over $50!</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ cursor: 'pointer', color: '#333' }}>English ▾</span>
          <span style={{ cursor: 'pointer', color: '#2B74D8' }}>Login</span>
          <span style={{ cursor: 'pointer', color: '#2B74D8' }}>Register</span>
        </div>
      </div>

      {/* Main Navbar - White Background */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #E0E0E0',
        padding: '12px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', marginRight: 8 }}>
          <img
            src="/logo-colored.png"
            alt="Brand"
            style={{ height: 36, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </Link>

        {/* Nav Links - BLACK color */}
        {['Home', 'Products', 'Deals', 'Help'].map((item, i) => (
          <Link
            key={item}
            to={i === 0 ? '/' : i === 1 ? '/products' : '#'}
            style={{
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
            onMouseEnter={e => e.target.style.color = '#2B74D8'}
            onMouseLeave={e => e.target.style.color = '#1a1a1a'}
          >
            {item}
          </Link>
        ))}

        {/* Search Bar */}
        <div style={{
          flex: 1, maxWidth: 500,
          display: 'flex',
          background: '#fff',
          borderRadius: 6,
          overflow: 'hidden',
          height: 40,
          border: '2px solid #2B74D8',
          marginLeft: 'auto',
        }}>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')
                navigate(`/products?search=${search}`);
            }}
            style={{
              flex: 1, border: 'none',
              padding: '0 14px', fontSize: 13,
              outline: 'none', color: '#333',
            }}
          />
          <select style={{
            border: 'none',
            borderLeft: '1px solid #E0E0E0',
            padding: '0 10px', fontSize: 12,
            background: '#fff', outline: 'none',
            cursor: 'pointer', color: '#333',
          }}>
            <option>All Category</option>
            <option>Phones</option>
            <option>Laptops</option>
            <option>Headphones</option>
            <option>Cameras</option>
            <option>Watches</option>
            <option>Gaming</option>
          </select>
          <button
            onClick={() => navigate(`/products?search=${search}`)}
            style={{
              background: '#2B74D8', border: 'none',
              padding: '0 20px', color: '#fff',
              cursor: 'pointer', fontSize: 13,
              fontWeight: 600,
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: 6 }} />
            Search
          </button>
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 16 }}>

          {/* Wishlist */}
          <div
            style={{ textAlign: 'center', cursor: 'pointer', color: '#333' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FF3333'}
            onMouseLeave={e => e.currentTarget.style.color = '#333'}
          >
            <FontAwesomeIcon icon={faHeart} style={{ fontSize: 20 }} />
            <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Wishlist</div>
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              textDecoration: 'none', color: '#333',
              textAlign: 'center', position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2B74D8'}
            onMouseLeave={e => e.currentTarget.style.color = '#333'}
          >
            <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: 20 }} />
            <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Cart</div>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: '#FF7D1A', color: '#fff',
                borderRadius: '50%', width: 17, height: 17,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {user ? (
  <div style={{ textAlign: 'center', cursor: 'pointer' }}
    onClick={logout}
  >
    <FontAwesomeIcon icon={faUser} style={{ fontSize: 20, color: '#2B74D8' }} />
    <div style={{ fontSize: 10, color: '#2B74D8', marginTop: 2, fontWeight: 600 }}>
      {user.name.split(' ')[0]}
    </div>
  </div>
) : (
  <Link to="/login" style={{ textDecoration: 'none', textAlign: 'center', color: '#333' }}>
    <FontAwesomeIcon icon={faUser} style={{ fontSize: 20 }} />
    <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Login</div>
  </Link>
)}
        </div>
      </nav>

      {/* Category Nav Bar - WHITE background, BLACK text */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E0E0E0',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>

        {/* All Category Button - Blue */}
        <div style={{
          background: '#2B74D8',
          color: '#fff',
          padding: '10px 20px',
          fontSize: 13, fontWeight: 600,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          gap: 8, whiteSpace: 'nowrap',
          marginRight: 8,
          borderRadius: '0 0 4px 4px',
        }}>
          <FontAwesomeIcon icon={faBars} />
          All Category
        </div>

        {/* Category Links - BLACK text */}
        {['Hot Offers', 'Gift Boxes', 'Projects', 'Menu Item', 'Help', 'Extra Menu'].map(item => (
          <div
            key={item}
            onClick={() => navigate('/products')}
            style={{
              color: '#333',
              padding: '10px 16px',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: '3px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#2B74D8';
              e.currentTarget.style.borderBottomColor = '#2B74D8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

export default Navbar;