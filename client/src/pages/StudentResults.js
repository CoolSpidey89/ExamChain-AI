import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      <h2 style={{ color: '#60a5fa', fontSize: '1.5rem', marginBottom: '2rem' }}>Your Result</h2>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem 2.5rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#93c5fd', marginBottom: '0.5rem' }}>
            {data.correctCount}/{data.totalQuestions}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Correct Answers</p>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem 2.5rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>
            {data.percentileScore}th
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Percentile</p>
        </div>
      </div>

      <p style={{ color: '#475569', marginTop: '2rem', fontSize: '0.9rem' }}>
        Your percentile shows how you ranked among your peers, accounting for question difficulty.
      </p>
    </div>
  );
}