import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StudentExamEntry({ setPage, setActiveExamId }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const inputRef = useRef(null);

  function handleChange(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(val);
    if (error) setError('');
  }

  async function handleJoin() {
  if (code.length !== 6) {
    triggerShake();
    setError('Enter the full 6-character code');
    return;
  }
  setLoading(true);
  setError('');

  const slowTimer = setTimeout(() => {
    setError('');
    setSlowNotice(true);
  }, 4000);

  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API}/exams/code/${code}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setActiveExamId(res.data._id);
    setPage('studentExam');
  } catch (err) {
    triggerShake();
    setError(err.response?.data?.error || 'Invalid exam code');
  }
  clearTimeout(slowTimer);
  setSlowNotice(false);
  setLoading(false);
}

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleJoin();
  }

  const boxes = Array.from({ length: 6 }, (_, i) => code[i] || '');

  return (
    <div className="auth-page">
      <div className="auth-glow"><span className="g1"></span><span className="g2"></span></div>
      <div className="auth-grain"></div>

      <div className="auth-page-inner">
        <div className={`auth-card entry-card ${shake ? 'error-shake' : ''}`}>
          <div className="admit-icon">🎫</div>
          <div className="auth-h1">Enter Exam Code</div>
          <div className="entry-sub">— ADMIT CODE REQUIRED —</div>

          {error && <div className="auth-error">⚠ {error}</div>}

          {slowNotice && (
            <div className="auth-success">⏳ Waking up the server — this can take up to 30 seconds on first load.</div>
          )}

          <div className="code-boxes" onClick={() => inputRef.current?.focus()}>
            {boxes.map((char, i) => (
              <div
                key={i}
                className={`code-box ${char ? 'filled' : ''} ${i === code.length ? 'active' : ''}`}
              >
                {char || '_'}
              </div>
            ))}
          </div>

          <input
            ref={inputRef}
            className="real-input"
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={6}
            autoFocus
          />

          <button className="auth-submit-btn student" onClick={handleJoin} disabled={loading}>
            {loading ? (slowNotice ? 'Waking server...' : 'Checking...') : 'Join Exam'}
          </button>

          <div className="entry-hint">Ask your teacher for the 6-character code</div>
        </div>
      </div>
    </div>
  );
}