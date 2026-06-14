import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function StudentExam({ examId }) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');

  async function startExam() {
    if (!studentId || !studentName) return;
    try {
      const res = await axios.get(`${API}/exam/start/${examId}/${studentId}`);
      setQuestions(res.data.questions);
      setStarted(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start exam');
    }
  }

  async function submitExam() {
    const answerArray = questions.map(q => ({
      questionId: q.questionId,
      variantIndex: q.variantIndex,
      selectedAnswer: answers[q.questionId] || ''
    }));

    const res = await axios.post(`${API}/exam/submit`, {
      studentId, studentName, examId, answers: answerArray
    });

    setScore(res.data.rawScore);
    setSubmitted(true);
  }

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: '#22c55e', fontSize: '2rem' }}>✅ Submitted!</h2>
      <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '1.1rem' }}>
        Your weighted score: <strong style={{ color: '#60a5fa' }}>{score}/100</strong>
      </p>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Final normalized score will appear in Results after all students submit.
      </p>
    </div>
  );

  if (!started) return (
    <div style={{ padding: '3rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#60a5fa', marginBottom: '1.5rem' }}>👨‍🎓 Student Login</h2>
      <input
        placeholder="Your Name"
        value={studentName}
        onChange={e => setStudentName(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Student ID"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
        style={{ ...inputStyle, marginTop: '1rem' }}
      />
      {error && <p style={{ color: '#f87171', marginTop: '0.5rem' }}>{error}</p>}
      <button
        onClick={startExam}
        style={{ ...btnStyle, marginTop: '1.5rem', width: '100%', background: '#3b82f6' }}
      >
        Start Exam
      </button>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ color: '#60a5fa' }}>📝 Your Exam — {studentName}</h2>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Variant set unique to: {studentId}
        </span>
      </div>

      {questions.map((q, i) => (
        <div key={q.questionId} style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Q{i + 1}. {q.concept}</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Difficulty: {q.difficulty}/5</span>
          </div>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>{q.questionText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {q.options.map((opt, j) => (
              <label key={j} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 1rem',
                background: answers[q.questionId] === opt[0] ? '#1e3a5f' : '#0f172a',
                border: `1px solid ${answers[q.questionId] === opt[0] ? '#3b82f6' : '#334155'}`,
                borderRadius: '8px',
                cursor: 'pointer'
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

      <button
        onClick={submitExam}
        style={{ ...btnStyle, width: '100%', background: '#22c55e', padding: '1rem' }}
      >
        Submit Exam
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: '#1e293b',
  border: '1px solid #334155',
  color: '#e2e8f0',
  padding: '0.75rem',
  borderRadius: '8px',
  fontSize: '0.95rem'
};

const btnStyle = {
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold'
};