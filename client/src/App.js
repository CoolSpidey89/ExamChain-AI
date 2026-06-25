import React, { useState, useEffect } from 'react';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherExamList from './pages/TeacherExamList';
import StudentExam from './pages/StudentExam';
import StudentExamEntry from './pages/StudentExamEntry';
import StudentResults from './pages/StudentResults';
import Results from './pages/Results';
import Home from './pages/Home';
import TeacherLogin from './pages/TeacherLogin';
import StudentLogin from './pages/StudentLogin';
import OTPVerify from './pages/OTPVerify';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [activeExamId, setActiveExamId] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveExamId(null);
    setVerifyEmail('');
    setPage('home');
  }

  return (
    <div>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <span onClick={() => setPage('home')} style={{ fontWeight: 'bold', color: '#60a5fa', marginRight: '1rem', cursor: 'pointer' }}>
          ⛓️ ExamChain
        </span>

        {!user && (
          <>
            <button onClick={() => setPage('teacherLogin')} style={navBtn}>Teacher Login</button>
            <button onClick={() => setPage('studentLogin')} style={navBtn}>Student Login</button>
          </>
        )}

        {user?.role === 'teacher' && (
          <button onClick={() => setPage('teacherExams')} style={navBtn}>My Exams</button>
        )}

        {user?.role === 'student' && (
          <>
            <button onClick={() => setPage('studentEntry')} style={navBtn}>Join Exam</button>
            {activeExamId && <button onClick={() => setPage('studentResults')} style={navBtn}>My Score</button>}
          </>
        )}

        {user && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {user.role === 'student' ? `🎓 ${user.name} (${user.rollNumber})` : `👨‍🏫 ${user.name}`}
            </span>
            <button onClick={handleLogout} style={{ ...navBtn, background: '#450a0a', color: '#f87171' }}>Logout</button>
          </div>
        )}
      </nav>

      {page === 'home' && <Home setPage={setPage} user={user} />}
      {page === 'teacherLogin' && <TeacherLogin setPage={setPage} setUser={setUser} setVerifyEmail={setVerifyEmail} />}
      {page === 'studentLogin' && <StudentLogin setPage={setPage} setUser={setUser} setVerifyEmail={setVerifyEmail} />}
      {page === 'teacherOtpVerify' && (
        <OTPVerify
          email={verifyEmail}
          setPage={setPage}
          setUser={setUser}
          redirectTo="teacherExams"
        />
      )}
      {page === 'studentOtpVerify' && (
        <OTPVerify
          email={verifyEmail}
          setPage={setPage}
          setUser={setUser}
          redirectTo="studentEntry"
        />
      )}
      {page === 'forgotPassword' && <ForgotPassword setPage={setPage} />}

      {page === 'teacherExams' && user?.role === 'teacher' && (
        <TeacherExamList setPage={setPage} setActiveExamId={setActiveExamId} />
      )}
      {page === 'teacherDashboard' && user?.role === 'teacher' && activeExamId && (
        <TeacherDashboard examId={activeExamId} setPage={setPage} />
      )}
      {page === 'results' && user?.role === 'teacher' && activeExamId && (
        <Results examId={activeExamId} />
      )}

      {page === 'studentEntry' && user?.role === 'student' && (
        <StudentExamEntry setPage={setPage} setActiveExamId={setActiveExamId} />
      )}
      {page === 'studentExam' && user?.role === 'student' && activeExamId && (
        <StudentExam examId={activeExamId} user={user} setPage={setPage} />
      )}
      {page === 'studentResults' && user?.role === 'student' && activeExamId && (
        <StudentResults examId={activeExamId} />
      )}

      {!user && (page === 'teacherExams' || page === 'teacherDashboard' || page === 'results') && (
        <TeacherLogin setPage={setPage} setUser={setUser} setVerifyEmail={setVerifyEmail} />
      )}
      {!user && (page === 'studentEntry' || page === 'studentExam' || page === 'studentResults') && (
        <StudentLogin setPage={setPage} setUser={setUser} setVerifyEmail={setVerifyEmail} />
      )}
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