import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Results({ examId }) {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => { fetchResults(); }, []);

  async function fetchResults() {
    const res = await axios.get(`${API}/results/${examId}`);
    setAttempts(res.data.attempts);
  }

  if (attempts.length === 0) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
      No submissions yet.
    </div>
  );

  const sorted = [...attempts].sort((a, b) => b.normalizedScore - a.normalizedScore);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#60a5fa', marginBottom: '1.5rem' }}>📊 Results — {examId}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Students" value={attempts.length} />
        <StatCard label="Average Score" value={Math.round(attempts.reduce((a, b) => a + b.normalizedScore, 0) / attempts.length)} />
        <StatCard label="Top Score" value={Math.max(...attempts.map(a => a.normalizedScore))} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b' }}>
            <th style={th}>Rank</th>
            <th style={th}>Student</th>
            <th style={th}>Raw Score</th>
            <th style={th}>Normalized Score</th>
            <th style={th}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => (
            <tr key={a._id} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
              <td style={td}>#{i + 1}</td>
              <td style={td}>{a.studentName || a.studentId}</td>
              <td style={td}>{a.rawScore}</td>
              <td style={td}>
                <span style={{
                  background: a.normalizedScore >= 60 ? '#14532d' : '#450a0a',
                  color: a.normalizedScore >= 60 ? '#22c55e' : '#f87171',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem'
                }}>
                  {a.normalizedScore}
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