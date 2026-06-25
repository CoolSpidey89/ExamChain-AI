import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function StudentExam({ examId, user, setPage }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const submittedRef = useRef(false);

  useEffect(() => { startExam(); }, []);

  useEffect(() => {
    if (timeLeft === null || submitted) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  function authHeader() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  async function startExam() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/exam/start/${examId}/${user.rollNumber}`, authHeader());
      setQuestions(res.data.questions);

      const deadline = new Date(res.data.deadline).getTime();
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((deadline - now) / 1000));
      setTimeLeft(remainingSeconds);
    } catch (err) {
      if (err.response?.data?.expired) {
        setError('Time is up for this exam. You can no longer attempt it.');
      } else {
        setError(err.response?.data?.error || 'Failed to load exam');
      }
    }
    setLoading(false);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function submitExam() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const answerArray = questions.map(q => ({
      questionId: q.questionId,
      variantIndex: q.variantIndex,
      selectedAnswer: answers[q.questionId] || ''
    }));

    try {
      const res = await axios.post(
        `${API}/exam/submit`,
        { studentId: user.rollNumber, studentName: user.name, examId, answers: answerArray },
        authHeader()
      );
      setScore(res.data.rawScore);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      submittedRef.current = false;
    }
  }

  async function handleAutoSubmit() {
    if (submittedRef.current) return;
    await submitExam();
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>Loading your exam...</div>;

  if (error) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => setPage('studentEntry')} style={{ background: '#334155', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>
        Try Another Code
      </button>
    </div>
  );

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: '#22c55e', fontSize: '2rem' }}>✅ Submitted!</h2>
      <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '1.1rem' }}>
        Your weighted score: <strong style={{ color: '#60a5fa' }}>{score}/100</strong>
      </p>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Final percentile will appear once your teacher releases scores.
      </p>
    </div>
  );

  const isLowTime = timeLeft !== null && timeLeft <= 60;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#0f172a',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0.75rem 0'
      }}>
        <h2 style={{ color: '#60a5fa' }}>📝 {user.name}'s Exam</h2>
        <div style={{
          background: isLowTime ? '#450a0a' : '#0f2940',
          border: `1px solid ${isLowTime ? '#dc2626' : '#3b82f6'}`,
          color: isLowTime ? '#f87171' : '#93c5fd',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          ⏱️ {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={q.questionId} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Question {i + 1}</span>
          </div>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>{q.questionText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {q.options.map((opt, j) => (
              <label key={j} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem',
                background: answers[q.questionId] === opt[0] ? '#1e3a5f' : '#0f172a',
                border: `1px solid ${answers[q.questionId] === opt[0] ? '#3b82f6' : '#334155'}`,
                borderRadius: '8px', cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name={q.questionId}
                  value={opt[0]}
                  checked={answers[q.questionId] === opt[0]}
                  onChange={() => setAnswers({ ...answers, [q.questionId]: opt[0] })}
                />
                <span style={{ color: '#e2e8f0' }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={submitExam} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', background: '#22c55e', fontSize: '1rem' }}>
        Submit Exam
      </button>
    </div>
  );
}