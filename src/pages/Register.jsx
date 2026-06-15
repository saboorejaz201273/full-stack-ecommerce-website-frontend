import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F0F2F5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #E0E0E0',
        padding: '40px', width: '100%', maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo-colored.png" alt="logo"
            style={{ height: 40, marginBottom: 12 }}
            onError={e => e.target.style.display = 'none'}
          />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
            Create Account
          </h2>
          <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
            Join us today!
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FFECEC', color: '#FF3333',
            padding: '10px 14px', borderRadius: 6,
            fontSize: 13, marginBottom: 16,
            border: '1px solid #FFCCCC',
          }}>
            ❌ {error}
          </div>
        )}

        <div>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faUser} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#999', fontSize: 14,
              }} />
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
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

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#999', fontSize: 14,
              }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faLock} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#999', fontSize: 14,
              }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%', padding: '11px 40px 11px 36px',
                  border: '1px solid #E0E0E0', borderRadius: 6,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#2B74D8'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'}
              />
              <FontAwesomeIcon
                icon={showPass ? faEyeSlash : faEye}
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', color: '#999',
                  cursor: 'pointer', fontSize: 14,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', background: '#2B74D8', color: '#fff',
              border: 'none', padding: '13px', borderRadius: 6,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
            Already have account?{' '}
            <Link to="/login" style={{ color: '#2B74D8', fontWeight: 600 }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;