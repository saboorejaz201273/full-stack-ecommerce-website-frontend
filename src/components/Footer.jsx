import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      background: '#1a5bb5',
      color: 'rgba(255,255,255,0.8)',
      padding: '40px 60px 20px',
      marginTop: 40
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 32,
        marginBottom: 32
      }}>

        {/* Brand Column */}
        <div>
          <img
            src="/logo-colored.png"
            alt="Brand Logo"
            style={{
              height: 40,
              width: 'auto',
              objectFit: 'contain',
              marginBottom: 12,
            }}
          />
          <p style={{
            fontSize: 13, lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 14
          }}>
            Your one-stop shop for electronics, fashion, and more.
            Quality products, best prices, fast delivery guaranteed.
          </p>
        </div>

        {/* Support */}
        <div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: '#fff', marginBottom: 12
          }}>
            Support
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              '123 Commerce St, NY',
              'support@shopzone.com',
              '+1 (800) 555-0100'
            ].map(item => (
              <li key={item} style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 8
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: '#fff', marginBottom: 12
          }}>
            Quick Links
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { label: 'Home', path: '/' },
              { label: 'Products', path: '/products' },
              { label: 'Cart', path: '/cart' },
            ].map(item => (
              <li key={item.label} style={{ marginBottom: 8 }}>
                <Link to={item.path} style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none'
                }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: '#fff', marginBottom: 12
          }}>
            Categories
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              'Phones', 'Laptops',
              'Headphones', 'Cameras', 'Watches'
            ].map(cat => (
              <li key={cat} style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 8,
                cursor: 'pointer'
              }}>
                {cat}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.15)',
        paddingTop: 16,
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)'
      }}>
        © 2024 ShopZone. All rights reserved.
        Built for internship project.
      </div>

    </footer>
  );
}

export default Footer;