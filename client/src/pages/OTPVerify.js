import React, { useState } from 'react';
import axios from 'axios';
import '../Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    <div className="auth-page">
      <div className="auth-glow"><span className="g1"></span><span className="g2"></span></div>
      <div className="auth-grain"></div>

      <div className="auth-page-inner">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-card-head">
            <div className="auth-h1">📧 Verify Your Email</div>
            <div className="auth-sub">
              We sent a 6-digit code to <strong style={{ color: '#E5C158' }}>{email}</strong>
            </div>
          </div>

          {error && <div className="auth-error">⚠ {error}</div>}
          {resendMsg && <div className="auth-success">✓ {resendMsg}</div>}

          <input
            className="auth-otp-input"
            placeholder="------"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />

          <button className="auth-submit-btn" onClick={handleVerify} disabled={loading} style={{ marginTop: '1.4rem' }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="auth-switch-link">
            Didn't get the code?{' '}
            <span onClick={handleResend}>{resending ? 'Sending...' : 'Resend OTP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}