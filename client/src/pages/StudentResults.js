import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function StudentResults({ examId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchScore(); }, []);

  async function fetchScore() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/results/student/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch your result');
    }
  }

  if (error) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#f87171' }}>{error}</div>
  );

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>Loading...</div>
  );

  if (!data.released) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: '#f59e0b', fontSize: '1.8rem' }}>🔒 Scores Not Released Yet</h2>
      <p style={{ color: '#64748b', marginTop: '1rem' }}>{data.message}</p>
    </div>
  );

  return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: '#60a5fa', fontSize: '1.5rem', marginBottom: '1rem' }}>Your Result</h2>
      <div style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        color: '#22c55e',
        margin: '1rem 0'
      }}>
        {data.percentileScore}th
      </div>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Percentile</p>
      <p style={{ color: '#475569', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        You can only see your own score — not your classmates' results.
      </p>
    </div>
  );
}