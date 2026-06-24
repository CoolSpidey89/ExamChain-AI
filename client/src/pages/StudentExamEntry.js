import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function StudentExamEntry({ setPage, setActiveExamId }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/exams/code/${code.toUpperCase()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveExamId(res.data._id);
      setPage('studentExam');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid exam code');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '400px', border: '1px solid #334155', textAlign: 'center' }}>
        <h2 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>🎓 Enter Exam Code</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Ask your teacher for the 6-character exam code
        </p>
        <input
          placeholder="e.g. A1B2C3"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          style={{
            width: '100%',
            background: '#0f172a',
            border: '1px solid #334155',
            color: '#e2e8f0',
            padding: '0.9rem',
            borderRadius: '8px',
            fontSize: '1.5rem',
            textAlign: 'center',
            letterSpacing: '0.3rem',
            fontFamily: 'monospace'
          }}
        />
        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</p>}
        <button
          onClick={handleJoin}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: '#22c55e'
          }}
        >
          {loading ? 'Checking...' : 'Join Exam'}
        </button>
      </div>
    </div>
  );
}