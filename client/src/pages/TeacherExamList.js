import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function TeacherExamList({ setPage, setActiveExamId }) {
  const [exams, setExams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', durationMinutes: 30 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchExams(); }, []);

  async function fetchExams() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API}/exams/my-exams`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setExams(res.data);
  }

  async function handleCreate() {
    if (!form.title) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    await axios.post(`${API}/exams/create`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ title: '', description: '', durationMinutes: 30 });
    setShowCreate(false);
    setLoading(false);
    fetchExams();
  }

  function openExam(examId) {
    setActiveExamId(examId);
    setPage('teacherDashboard');
  }

  function openResults(examId) {
    setActiveExamId(examId);
    setPage('results');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#60a5fa' }}>📋 Your Exams</h2>
        <button onClick={() => setShowCreate(!showCreate)} style={btnStyle}>
          {showCreate ? 'Cancel' : '+ Create New Exam'}
        </button>
      </div>

      {showCreate && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #334155' }}>
          <input
            placeholder="Exam Title (e.g. Physics Midterm 2026)"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, marginTop: '0.75rem' }}
            rows={2}
          />
          <select
            value={form.durationMinutes}
            onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            style={{ ...inputStyle, marginTop: '0.75rem' }}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{ ...btnStyle, marginTop: '1rem', width: '100%' }}
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      )}

      {exams.length === 0 && !showCreate && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          No exams yet. Create your first one above.
        </div>
      )}

      {exams.map(exam => (
        <div key={exam._id} style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ color: '#e2e8f0', marginBottom: '0.25rem' }}>{exam.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{exam.description}</p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{
                background: '#0f172a',
                color: '#60a5fa',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                border: '1px solid #334155'
              }}>
                Code: {exam.examCode}
              </span>
              <span style={{ color: exam.locked ? '#22c55e' : '#f59e0b', fontSize: '0.8rem' }}>
                {exam.locked ? '🔒 Locked' : '🟡 Draft'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => openExam(exam._id)} style={smallBtn}>
              Manage
            </button>
            <button onClick={() => openResults(exam._id)} style={{ ...smallBtn, background: '#7c3aed' }}>
              Results
            </button>
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
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

const smallBtn = {
  background: '#334155',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem'
};