import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function TeacherDashboard({ examId, setPage }) {
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState({ original: '', concept: '', difficulty: 3 });
  const [questions, setQuestions] = useState([]);
  const [previewVariants, setPreviewVariants] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchExam();
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleGeneratePreview() {
    if (!form.original || !form.concept) return;
    setLoading(true);
    setMessage('Generating AI variants for review...');
    setPreviewVariants(null);
    try {
      const res = await axios.post(`${API}/questions/preview`, { ...form, examId }, authHeader());
      setPreviewVariants(res.data.variants);
      setMessage('');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  }

  function updateVariantField(index, field, value) {
    const updated = [...previewVariants];
    updated[index] = { ...updated[index], [field]: value };
    setPreviewVariants(updated);
  }

  function updateVariantOption(index, optIndex, value) {
    const updated = [...previewVariants];
    const opts = [...updated[index].options];
    opts[optIndex] = value;
    updated[index] = { ...updated[index], options: opts };
    setPreviewVariants(updated);
  }

  function discardVariant(index) {
    setPreviewVariants(previewVariants.filter((_, i) => i !== index));
  }

  async function handleConfirm() {
    if (!previewVariants || previewVariants.length === 0) {
      setMessage('No variants left to add. Generate again.');
      return;
    }
    setConfirming(true);
    try {
      await axios.post(`${API}/questions/confirm`, {
        ...form,
        examId,
        variants: previewVariants
      }, authHeader());

      setMessage('Question added to chain ✅');
      setForm({ original: '', concept: '', difficulty: 3 });
      setPreviewVariants(null);
      fetchQuestions();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
    setConfirming(false);
  }

  function handleCancelPreview() {
    setPreviewVariants(null);
    setMessage('');
  }

  async function handleLock() {
    await axios.post(`${API}/exams/lock/${examId}`, {}, authHeader());
    setMessage('Exam locked on blockchain 🔒');
    fetchExam();
    fetchQuestions();
  }

  async function handleVerify() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await axios.get(`${API}/questions/verify/${examId}`, authHeader());
      setVerifyResult(res.data);
    } catch (err) {
      setMessage('Verification error: ' + (err.response?.data?.error || err.message));
    }
    setVerifying(false);
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

      {!exam.locked && !previewVariants && (
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
            onClick={handleGeneratePreview}
            disabled={loading}
            style={{ ...btnStyle, marginTop: '1rem', background: '#3b82f6' }}
          >
            {loading ? 'Generating...' : '⚡ Generate Variants for Review'}
          </button>
        </div>
      )}

      {previewVariants && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fbbf24' }}>📝 Review Before Adding to Chain</h3>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{previewVariants.length} variants</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Edit any wording or fix incorrect answers below. Nothing is saved until you confirm.
          </p>

          {previewVariants.map((v, i) => (
            <div key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.85rem' }}>Variant {i + 1}</span>
                <button onClick={() => discardVariant(i)} style={discardBtn}>✕ Discard</button>
              </div>

              <textarea
                value={v.questionText}
                onChange={e => updateVariantField(i, 'questionText', e.target.value)}
                style={{ ...inputStyle, marginBottom: '0.75rem' }}
                rows={2}
              />

              {v.options.map((opt, j) => (
                <input
                  key={j}
                  value={opt}
                  onChange={e => updateVariantOption(i, j, e.target.value)}
                  style={{ ...inputStyle, marginBottom: '0.5rem', fontSize: '0.85rem' }}
                />
              ))}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Correct Answer:</span>
                <select
                  value={v.correctAnswer}
                  onChange={e => updateVariantField(i, 'correctAnswer', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={handleCancelPreview} style={{ ...btnStyle, background: '#334155', flex: 1 }}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={confirming} style={{ ...btnStyle, background: '#22c55e', flex: 2 }}>
              {confirming ? 'Saving to Chain...' : '✅ Confirm & Add to Chain'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div style={{ background: '#0f2940', border: '1px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#93c5fd' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#e2e8f0' }}>Question Chain ({questions.length} blocks)</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {questions.length > 0 && (
            <button onClick={handleVerify} disabled={verifying} style={{ ...btnStyle, background: '#7c3aed' }}>
              {verifying ? 'Verifying...' : '🔍 Verify Chain'}
            </button>
          )}
          {!exam.locked && questions.length > 0 && (
            <button onClick={handleLock} style={{ ...btnStyle, background: '#dc2626' }}>
              🔒 Lock Exam
            </button>
          )}
          {exam.locked && <span style={{ color: '#22c55e', alignSelf: 'center' }}>🔒 Exam Locked</span>}
        </div>
      </div>

      {verifyResult && (
        <div style={{
          background: verifyResult.chainValid ? '#14532d' : '#450a0a',
          border: `1px solid ${verifyResult.chainValid ? '#22c55e' : '#dc2626'}`,
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: verifyResult.chainValid ? '#86efac' : '#f87171', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {verifyResult.chainValid
              ? `✅ Chain Verified — all ${verifyResult.totalBlocks} blocks intact`
              : `🚨 TAMPERING DETECTED — chain integrity broken`}
          </p>
          {!verifyResult.chainValid && (
            <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontFamily: 'monospace' }}>
              {verifyResult.blocks.filter(b => !b.valid).map(b => (
                <div key={b.blockIndex}>
                  Block #{b.blockIndex + 1} ({b.concept}): {!b.hashMatches ? 'content modified' : ''} {!b.linkMatches ? 'chain link broken' : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

const discardBtn = {
  background: 'transparent',
  border: '1px solid #dc2626',
  color: '#f87171',
  padding: '0.2rem 0.6rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.75rem'
};