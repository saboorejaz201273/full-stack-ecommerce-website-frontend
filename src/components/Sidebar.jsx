import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMobileScreen, faLaptop, faHeadphones,
  faCamera, faClock, faGamepad,
  faShirt, faHouse, faWrench,
} from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = [
  { name: 'Phones & Tablets', icon: faMobileScreen },
  { name: 'Computers & Laptops', icon: faLaptop },
  { name: 'Headphones', icon: faHeadphones },
  { name: 'Cameras', icon: faCamera },
  { name: 'Smart Watches', icon: faClock },
  { name: 'Gaming', icon: faGamepad },
  { name: 'Clothing & Fashion', icon: faShirt },
  { name: 'Home & Garden', icon: faHouse },
  { name: 'More Category', icon: faWrench },
];

function Sidebar({ activeCategory, setActiveCategory }) {
  const navigate = useNavigate();

  return (
    <aside style={{ width: 220, flexShrink: 0 }}>
      <div style={{
        background: '#fff',
        border: '1px solid #E0E0E0',
        borderRadius: 0,
        overflow: 'hidden',
      }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat.name}
            onClick={() => {
              if (setActiveCategory) setActiveCategory(cat.name);
              navigate('/products');
            }}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 12, padding: '10px 16px',
              fontSize: 13, cursor: 'pointer',
              color: '#444',
              borderBottom: '1px solid #f5f5f5',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#EBF3FF';
              e.currentTarget.style.color = '#2B74D8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#444';
            }}
          >
            <FontAwesomeIcon
              icon={cat.icon}
              style={{ width: 16, color: 'inherit' }}
            />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;