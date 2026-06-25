import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function TeacherLogin({ setPage, setUser, setVerifyEmail }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        const res = await axios.post(`${API}/auth/teacher/register`, form);
        setPage('teacherOtpVerify');
        setVerifyEmail(form.email); // see note below
      } else {
        const res = await axios.post(`${API}/auth/teacher/login`, form);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setPage('teacherExams');
      }
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        setPage('teacherOtpVerify');
        setVerifyEmail(form.email);
      } else {
        setError(err.response?.data?.error || 'Something went wrong');
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '400px', border: '1px solid #334155' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>👨‍🏫 Teacher Portal</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {mode === 'login' ? 'Login to manage your exams' : 'Create a teacher account'}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setMode('login')}
            style={{ ...tabBtn, background: mode === 'login' ? '#3b82f6' : '#0f172a' }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{ ...tabBtn, background: mode === 'register' ? '#3b82f6' : '#0f172a' }}
          >
            Register
          </button>
        </div>

        {mode === 'register' && (
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ ...inputStyle, marginTop: '0.75rem' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ ...inputStyle, marginTop: '0.75rem' }}
        />

        <p
          onClick={() => setPage('forgotPassword')}
          style={{ color: '#60a5fa', fontSize: '0.8rem', marginTop: '0.5rem', cursor: 'pointer', textAlign: 'right' }}
        >
          Forgot password?
        </p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...btnStyle, marginTop: '1.5rem', width: '100%', background: '#3b82f6' }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>

        <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center' }}>
          Are you a student?{' '}
          <span
            onClick={() => setPage('studentLogin')}
            style={{ color: '#60a5fa', cursor: 'pointer' }}
          >
            Student Login
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #334155',
  color: '#e2e8f0',
  padding: '0.75rem',
  borderRadius: '8px',
  fontSize: '0.95rem'
};

const btnStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.95rem'
};

const tabBtn = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '6px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600'
};