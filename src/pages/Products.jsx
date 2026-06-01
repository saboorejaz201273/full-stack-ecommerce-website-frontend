import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PRODUCTS from '../data/products';

function Products({ addToCart }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [sort, setSort] = useState('default');
  const [filterCat, setFilterCat] = useState([]);

  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  let filtered = PRODUCTS.filter(p => {
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCat.length === 0 || filterCat.includes(p.category);
    return matchSearch && matchCat;
  });

  if (sort === 'asc') filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  const toggleCat = (cat) => {
    setFilterCat(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div style={{ background: '#F0F2F5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 20, padding: '24px 40px' }}>

        {/* Sidebar Filter */}
        <aside style={{ width: 200, flexShrink: 0 }}>
          <div style={{
            background: '#fff',
            border: '1px solid #E0E0E0',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              background: '#2B74D8', color: '#fff',
              padding: '12px 16px',
              fontWeight: 700, fontSize: 13,
            }}>
              Filter by Category
            </div>
            {categories.map(cat => (
              <label key={cat} style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: '10px 16px',
                fontSize: 13, cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <input
                  type="checkbox"
                  checked={filterCat.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  style={{ accentColor: '#2B74D8' }}
                />
                {cat}
              </label>
            ))}
          </div>
        </aside>

        {/* Main Products */}
        <div style={{ flex: 1 }}>
          {/* Top bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16,
            background: '#fff', border: '1px solid #E0E0E0',
            borderRadius: 8, padding: '10px 16px',
          }}>
            <span style={{ fontSize: 13, color: '#999' }}>
              {filtered.length} products
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                border: '1px solid #E0E0E0',
                borderRadius: 6, padding: '6px 12px',
                fontSize: 13, outline: 'none',
              }}
            >
              <option value="default">Default Sorting</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p>No products found.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 16,
            }}>
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;