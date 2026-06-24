import React from 'react';

export default function Home({ setPage, user }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#60a5fa', marginBottom: '1rem' }}>⛓️ ExamChain</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
        Secure · Fair · Intelligent Examinations
      </p>
      <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '3rem' }}>
        Blockchain-secured · AI-generated variants · Percentile-based scoring
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        {!user && (
          <>
            <Card title="👨‍🏫 Teacher" desc="Create exams, generate AI question variants, lock on chain" onClick={() => setPage('teacherLogin')} color="#3b82f6" />
            <Card title="👨‍🎓 Student" desc="Join an exam with a code and get your unique paper" onClick={() => setPage('studentLogin')} color="#22c55e" />
          </>
        )}

        {user?.role === 'teacher' && (
          <Card title="📋 My Exams" desc="View, create, and manage your exams" onClick={() => setPage('teacherExams')} color="#3b82f6" />
        )}

        {user?.role === 'student' && (
          <Card title="🎓 Join Exam" desc="Enter an exam code to begin" onClick={() => setPage('studentEntry')} color="#22c55e" />
        )}
      </div>
    </div>
  );
}

function Card({ title, desc, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '2rem',
        width: '220px',
        cursor: 'pointer'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{title.split(' ')[0]}</div>
      <h3 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>{title.split(' ').slice(1).join(' ')}</h3>
      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{desc}</p>
    </div>
  );
}