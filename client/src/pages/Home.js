import React from 'react';

export default function Home({ setPage }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#60a5fa', marginBottom: '1rem' }}>
        ⛓️ ExamChain
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Secure · Fair · Intelligent Examinations
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Card
          title="👨‍🏫 Teacher"
          desc="Upload questions, generate AI variants, lock exam on chain"
          onClick={() => setPage('teacher')}
        />
        <Card
          title="👨‍🎓 Student"
          desc="Take your unique exam variant — no two students get the same paper"
          onClick={() => setPage('student')}
        />
        <Card
          title="📊 Results"
          desc="View normalized scores and concept-wise performance"
          onClick={() => setPage('results')}
        />
      </div>
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '2rem',
      width: '220px',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#60a5fa'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{title.split(' ')[0]}</div>
      <h3 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>{title.split(' ').slice(1).join(' ')}</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{desc}</p>
    </div>
  );
}