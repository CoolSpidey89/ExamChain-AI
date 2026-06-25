import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function OTPVerify({ email, setPage, setUser, redirectTo }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  async function handleVerify() {
    if (!otp) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setPage(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    }
    setLoading(false);
  }

  async function handleResend() {
    setResending(true);
    setResendMsg('');
    try {
      await axios.post(`${API}/auth/resend-otp`, { email });
      setResendMsg('New OTP sent to your email');
    } catch (err) {
      setResendMsg(err.response?.data?.error || 'Failed to resend');
    }
    setResending(false);
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '400px', border: '1px solid #334155', textAlign: 'center' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>📧 Verify Your Email</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
          We sent a 6-digit code to <strong style={{ color: '#93c5fd' }}>{email}</strong>
        </p>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          style={{
            width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0',
            padding: '0.9rem', borderRadius: '8px', fontSize: '1.5rem', textAlign: 'center',
            letterSpacing: '0.3rem', fontFamily: 'monospace'
          }}
        />

        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
        {resendMsg && <p style={{ color: '#86efac', fontSize: '0.85rem', marginTop: '0.75rem' }}>{resendMsg}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', background: '#3b82f6' }}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          Didn't get the code?{' '}
          <span onClick={handleResend} style={{ color: '#60a5fa', cursor: resending ? 'default' : 'pointer' }}>
            {resending ? 'Sending...' : 'Resend OTP'}
          </span>
        </p>
      </div>
    </div>
  );
}