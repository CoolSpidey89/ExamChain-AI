import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Results({ examId }) {
  const [attempts, setAttempts] = useState([]);
  const [released, setReleased] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchResults(); }, []);

  async function fetchResults() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API}/results/teacher/${examId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAttempts(res.data.attempts);
    setReleased(res.data.released);
  }

  async function handleRelease() {
    setLoading(true);
    const token = localStorage.getItem('token');
    await axios.post(`${API}/results/release/${examId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReleased(true);
    setLoading(false);
  }

  async function handleUnrelease() {
    setLoading(true);
    const token = localStorage.getItem('token');
    await axios.post(`${API}/results/unrelease/${examId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReleased(false);
    setLoading(false);
  }

  if (attempts.length === 0) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
      No submissions yet.
    </div>
  );

  const sorted = [...attempts].sort((a, b) => b.normalizedScore - a.normalizedScore);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#60a5fa' }}>📊 Teacher Report — {examId}</h2>
        {!released ? (
          <button onClick={handleRelease} disabled={loading} style={releaseBtn('#22c55e')}>
            {loading ? 'Releasing...' : '🔓 Release Scores to Students'}
          </button>
        ) : (
          <button onClick={handleUnrelease} disabled={loading} style={releaseBtn('#dc2626')}>
            {loading ? 'Hiding...' : '🔒 Hide Scores'}
          </button>
        )}
      </div>

      <div style={{
        background: released ? '#14532d' : '#451a03',
        border: `1px solid ${released ? '#22c55e' : '#f59e0b'}`,
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        color: released ? '#86efac' : '#fbbf24',
        fontSize: '0.9rem'
      }}>
        {released
          ? '✅ Scores are LIVE — students can see their individual percentile now'
          : '🔒 Scores are HIDDEN — students cannot see their results yet'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Students" value={attempts.length} />
        <StatCard label="Average Percentile" value={Math.round(attempts.reduce((a, b) => a + b.normalizedScore, 0) / attempts.length)} />
        <StatCard label="Top Percentile" value={Math.max(...attempts.map(a => a.normalizedScore))} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b' }}>
            <th style={th}>Rank</th>
            <th style={th}>Student</th>
            <th style={th}>Roll No.</th>
            <th style={th}>Raw Score</th>
            <th style={th}>Percentile</th>
            <th style={th}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => (
            <tr key={a._id} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
              <td style={td}>#{i + 1}</td>
              <td style={td}>{a.studentName}</td>
              <td style={td}>{a.studentId}</td>
              <td style={td}>{a.rawScore}</td>
              <td style={td}>
                <span style={{
                  background: a.normalizedScore >= 60 ? '#14532d' : '#450a0a',
                  color: a.normalizedScore >= 60 ? '#22c55e' : '#f87171',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem'
                }}>
                  {a.normalizedScore}th
                </span>
              </td>
              <td style={td}>{getGrade(a.normalizedScore)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{value}</div>
      <div style={{ color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

function getGrade(score) {
  if (score >= 80) return '🏆 A';
  if (score >= 65) return '✅ B';
  if (score >= 50) return '📘 C';
  return '❌ D';
}

function releaseBtn(color) {
  return {
    background: color,
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  };
}

const th = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  color: '#94a3b8',
  fontWeight: '600',
  borderBottom: '1px solid #334155'
};

const td = {
  padding: '0.75rem 1rem',
  color: '#e2e8f0',
  borderBottom: '1px solid #1e293b'
};
