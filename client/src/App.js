import React, { useState, useEffect } from 'react';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentExam from './pages/StudentExam';
import Results from './pages/Results';
import Home from './pages/Home';
import TeacherLogin from './pages/TeacherLogin';
import StudentLogin from './pages/StudentLogin';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const examId = 'EXAM001';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home');
  }

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
        <span
          onClick={() => setPage('home')}
          style={{ fontWeight: 'bold', color: '#60a5fa', marginRight: '1rem', cursor: 'pointer' }}
        >
          ⛓️ ExamChain
        </span>

        {!user && (
          <>
            <button onClick={() => setPage('teacherLogin')} style={navBtn}>Teacher Login</button>
            <button onClick={() => setPage('studentLogin')} style={navBtn}>Student Login</button>
          </>
        )}

        {user?.role === 'teacher' && (
          <>
            <button onClick={() => setPage('teacher')} style={navBtn}>Dashboard</button>
            <button onClick={() => setPage('results')} style={navBtn}>Results</button>
          </>
        )}

        {user?.role === 'student' && (
          <button onClick={() => setPage('student')} style={navBtn}>My Exam</button>
        )}

        {user && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {user.role === 'student' ? `🎓 ${user.name} (${user.rollNumber})` : `👨‍🏫 ${user.name}`}
            </span>
            <button onClick={handleLogout} style={{ ...navBtn, background: '#450a0a', color: '#f87171' }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {page === 'home' && <Home setPage={setPage} user={user} />}
      {page === 'teacherLogin' && <TeacherLogin setPage={setPage} setUser={setUser} />}
      {page === 'studentLogin' && <StudentLogin setPage={setPage} setUser={setUser} />}
      {page === 'teacher' && user?.role === 'teacher' && <TeacherDashboard examId={examId} user={user} />}
      {page === 'student' && user?.role === 'student' && <StudentExam examId={examId} user={user} />}
      {page === 'results' && <Results examId={examId} />}

      {/* Redirect if wrong role tries to access a page */}
      {page === 'teacher' && !user && <TeacherLogin setPage={setPage} setUser={setUser} />}
      {page === 'student' && !user && <StudentLogin setPage={setPage} setUser={setUser} />}
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