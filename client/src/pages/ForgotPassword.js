import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword({ setPage }) {
  const [step, setStep] = useState('request'); // request -> reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setStep('reset');
      setMessage('OTP sent to your email');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
    setLoading(false);
  }

  async function handleReset() {
    if (!otp || !newPassword) return;
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/reset-password`, { email, otp, newPassword });
      setMessage('Password reset! Redirecting to login...');
      setTimeout(() => setPage('home'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '400px', border: '1px solid #334155' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>🔑 Reset Password</h2>

        {step === 'request' && (
          <>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Enter your email to receive a reset code
            </p>
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
            <button onClick={handleRequest} disabled={loading} style={{ ...btnStyle, marginTop: '1.5rem', width: '100%' }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            {message && <p style={{ color: '#86efac', fontSize: '0.85rem', marginBottom: '1rem' }}>{message}</p>}
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={inputStyle}
            />
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ ...inputStyle, marginTop: '0.75rem' }}
            />
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
            <button onClick={handleReset} disabled={loading} style={{ ...btnStyle, marginTop: '1.5rem', width: '100%' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        <p
          onClick={() => setPage('home')}
          style={{ color: '#475569', fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
        >
          ← Back to home
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0',
  padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem'
};

const btnStyle = {
  padding: '0.75rem', borderRadius: '8px', border: 'none', color: 'white',
  cursor: 'pointer', fontWeight: 'bold', background: '#3b82f6'
};