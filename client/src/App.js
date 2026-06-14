import React, { useState } from 'react';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentExam from './pages/StudentExam';
import Results from './pages/Results';
import Home from './pages/Home';

export default function App() {
  const [page, setPage] = useState('home');
  const [examId] = useState('EXAM001');

  return (
    <div>
      <nav style={{
        background: '#1e293b',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        borderBottom: '1px solid #334155'
      }}>
        <span style={{ fontWeight: 'bold', color: '#60a5fa', marginRight: '1rem' }}>
          ⛓️ ExamChain
        </span>
        <button onClick={() => setPage('home')} style={navBtn}>Home</button>
        <button onClick={() => setPage('teacher')} style={navBtn}>Teacher</button>
        <button onClick={() => setPage('student')} style={navBtn}>Student Exam</button>
        <button onClick={() => setPage('results')} style={navBtn}>Results</button>
        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.85rem' }}>
          Exam ID: {examId}
        </span>
      </nav>

      {page === 'home' && <Home setPage={setPage} />}
      {page === 'teacher' && <TeacherDashboard examId={examId} />}
      {page === 'student' && <StudentExam examId={examId} />}
      {page === 'results' && <Results examId={examId} />}
    </div>
  );
}

const navBtn = {
  background: '#334155',
  color: '#e2e8f0',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem'
};
