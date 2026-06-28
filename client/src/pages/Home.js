import React from 'react';
import '../Home.css';

export default function Home({ setPage, user }) {
  return (
    <div className="home-page">
      <div className="glow">
        <span className="g1"></span>
        <span className="g2"></span>
        <span className="g3"></span>
      </div>
      <div className="grain"></div>

      <div className="page-content">
        <div className="eyebrow">For schools, colleges &amp; institutions</div>
        <h1 className="brand">Exam<span className="accent">Chain</span></h1>
        <p className="subhead">
          Secure and improved system of <b>MCQ-based examinations</b> — built for fairness from the ground up.
        </p>

        <div className="cards">
          {!user && (
            <>
              <div className="glass-card teacher" onClick={() => setPage('teacherLogin')}>
                <div className="card-icon">🗂️</div>
                <div className="card-title">Teacher</div>
                <div className="card-desc">Login to your teacher dashboard.</div>
                <div className="card-arrow">Continue →</div>
              </div>
              <div className="glass-card student" onClick={() => setPage('studentLogin')}>
                <div className="card-icon">🎓</div>
                <div className="card-title">Student</div>
                <div className="card-desc">Login to your student dashboard, Enter your Exam Code to appear the paper.</div>
                <div className="card-arrow">Continue →</div>
              </div>
            </>
          )}

          {user?.role === 'teacher' && (
            <div className="glass-card teacher" onClick={() => setPage('teacherExams')}>
              <div className="card-icon">🗂️</div>
              <div className="card-title">My Exams</div>
              <div className="card-desc">View, create, and manage your exams.</div>
              <div className="card-arrow">Continue →</div>
            </div>
          )}

          {user?.role === 'student' && (
            <div className="glass-card student" onClick={() => setPage('studentEntry')}>
              <div className="card-icon">🎓</div>
              <div className="card-title">Join Exam</div>
              <div className="card-desc">Enter an exam code to begin.</div>
              <div className="card-arrow">Continue →</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}