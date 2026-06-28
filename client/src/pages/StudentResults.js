import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Results.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StudentResults({ examId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchScore(); }, []);

  async function fetchScore() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/results/student/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch your result');
    }
  }

  if (error) return (
    <div className="student-results-page">
      <div className="student-reveal">
        <p style={{ color: '#E7A0A2' }}>{error}</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="student-results-page">
      <div className="student-reveal">Loading...</div>
    </div>
  );

  if (!data.released) return (
    <div className="student-results-page">
      <div className="student-reveal">
        <div className="locked-card">
          <div className="lock-icon">🔒</div>
          <div className="locked-title">Scores Not Released Yet</div>
          <div className="locked-sub">{data.message}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="student-results-page">
      <div className="student-reveal">
        <div className="reveal-h1">Your Result</div>
        <div className="reveal-cards">
          <div className="reveal-card score">
            <div className="reveal-num">{data.correctCount}/{data.totalQuestions}</div>
            <div className="reveal-label">Correct Answers</div>
          </div>
          <div className="reveal-card pctl">
            <div className="reveal-num">{data.percentileScore}th</div>
            <div className="reveal-label">Percentile</div>
          </div>
        </div>
        <div className="reveal-foot">
          Your percentile reflects how you ranked among your peers, accounting for question difficulty.
        </div>
      </div>
    </div>
  );
}