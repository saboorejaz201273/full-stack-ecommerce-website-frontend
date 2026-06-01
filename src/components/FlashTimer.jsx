import React, { useState, useEffect } from 'react';

function FlashTimer() {
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

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E0E0E0',
      borderRadius: 8,
      padding: '14px 18px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Title */}
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#FF3333',
      }}>
        ⚡ Flash Sale
      </div>

      <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>
        Ends in:
      </span>

      {/* Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          background: '#2B74D8',
          color: '#fff',
          width: 40,
          height: 40,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 800,
        }}>
          {h}
        </div>

        <span style={{ color: '#2B74D8', fontWeight: 800, fontSize: 18 }}>:</span>

        <div style={{
          background: '#2B74D8',
          color: '#fff',
          width: 40,
          height: 40,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 800,
        }}>
          {m}
        </div>

        <span style={{ color: '#2B74D8', fontWeight: 800, fontSize: 18 }}>:</span>

        <div style={{
          background: '#2B74D8',
          color: '#fff',
          width: 40,
          height: 40,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 800,
        }}>
          {s}
        </div>
      </div>

      <span style={{
        marginLeft: 'auto',
        fontSize: 12,
        color: '#2B74D8',
        fontWeight: 600,
        cursor: 'pointer',
      }}>
        View All →
      </span>
    </div>
  );
}

export default FlashTimer;