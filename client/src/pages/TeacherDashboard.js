import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function TeacherDashboard({ examId, setPage }) {
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({ original: '', concept: '', difficulty: 3 });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExam();
    fetchQuestions();
  }, []);

  function authHeader() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  async function fetchExam() {
    const res = await axios.get(`${API}/exams/${examId}`, authHeader());
    setExam(res.data);
  }

  async function fetchQuestions() {
    const res = await axios.get(`${API}/questions/${examId}`, authHeader());
    setQuestions(res.data);
  }

  async function handleAdd() {
    if (!form.original || !form.concept) return;
    setLoading(true);
    setMessage('Generating AI variants...');
    try {
      await axios.post(`${API}/questions/add`, { ...form, examId }, authHeader());
      setMessage('Question added to chain ✅');
      setForm({ original: '', concept: '', difficulty: 3 });
      fetchQuestions();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  }

  async function handleLock() {
    await axios.post(`${API}/exams/lock/${examId}`, {}, authHeader());
    setMessage('Exam locked on blockchain 🔒');
    fetchExam();
    fetchQuestions();
  }

  if (!exam) return <div style={{ padding: '2rem', color: '#64748b' }}>Loading exam...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => setPage('teacherExams')} style={backBtn}>← Back to Exams</button>

      <h2 style={{ color: '#60a5fa', marginBottom: '0.25rem', marginTop: '1rem' }}>{exam.title}</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Exam Code: <strong style={{ color: '#93c5fd' }}>{exam.examCode}</strong>
        {' '}— Duration: <strong style={{ color: '#93c5fd' }}>{exam.durationMinutes} min</strong>
      </p>

      {!exam.locked && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>Add Question</h3>
          <textarea
            placeholder="Enter base question..."
            value={form.original}
            onChange={e => setForm({ ...form, original: e.target.value })}
            style={inputStyle}
            rows={3}
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input
              placeholder="Concept (e.g. Newton's Laws)"
              value={form.concept}
              onChange={e => setForm({ ...form, concept: e.target.value })}
              style={{ ...inputStyle, flex: 2 }}
            />
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: Number(e.target.value) })}
              style={{ ...inputStyle, flex: 1 }}
            >
              {[1,2,3,4,5].map(d => <option key={d} value={d}>Difficulty {d}</option>)}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{ ...btnStyle, marginTop: '1rem', background: '#3b82f6' }}
          >
            {loading ? 'Generating...' : '⚡ Generate Variants & Add to Chain'}
          </button>
        </div>
      )}

      {message && (
        <div style={{ background: '#0f2940', border: '1px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#93c5fd' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#e2e8f0' }}>Question Chain ({questions.length} blocks)</h3>
        {!exam.locked && questions.length > 0 && (
          <button onClick={handleLock} style={{ ...btnStyle, background: '#dc2626' }}>
            🔒 Lock Exam
          </button>
        )}
        {exam.locked && <span style={{ color: '#22c55e' }}>🔒 Exam Locked</span>}
      </div>

      {questions.map((q, i) => (
        <div key={q._id} style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Block #{i + 1} — {q.concept}</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Difficulty: {q.difficulty}/5</span>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{q.original}</p>
          <div style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            Hash: {q.hash?.substring(0, 32)}...
          </div>
          <div style={{ color: '#374151', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            PrevHash: {q.prevHash?.substring(0, 32)}...
          </div>
          <div style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
            {q.variants?.length} variants generated
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: '#0f172a',
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

const backBtn = {
  background: 'transparent',
  border: '1px solid #334155',
  color: '#94a3b8',
  padding: '0.4rem 0.9rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem'
};