# ⛓️ ExamChain — Secure, Fair & Intelligent Examinations

--

## 🧠 What is ExamChain?

ExamChain is a blockchain-inspired examination platform that solves three core problems with traditional exams:

- **Cheating** — Every student gets a uniquely generated question variant. Copying answers is useless.
- **Unfairness** — Scores are normalized across difficulty levels so harder questions are rewarded more.
- **Integrity** — Questions are stored in an append-only hash chain. Once locked, no one can alter the exam.

---

## ✨ Features

### 👨‍🏫 For Teachers
- Add base questions with concept tags and difficulty levels (1–5)
- AI automatically generates **5 unique variants** of each question using LLMs
- Questions are stored as **blocks in a hash chain** — each block references the previous one
- Lock the exam before it starts — locked exams cannot be modified

### 👨‍🎓 For Students
- Login with name and student ID
- Receive a **unique set of question variants** — no two students get the same paper
- Clean, distraction-free exam interface with radio button answers
- One attempt per student enforced

### 📊 For Results
- **Difficulty-weighted scoring** — harder questions carry more weight
- **Normalized scores** across the cohort using standard deviation
- Grade distribution (A/B/C/D) with color-coded leaderboard
- Average score and top score stats

---

## 🔐 Blockchain-Inspired Security

ExamChain implements a lightweight hash chain for question integrity:

```
Block #1                    Block #2                    Block #3
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ concept: Laws   │         │ concept: Motion │         │ concept: Force  │
│ variants: [...] │         │ variants: [...] │         │ variants: [...] │
│ prevHash: "0"   │────────▶│ prevHash: abc.. │────────▶│ prevHash: def.. │
│ hash: abc...    │         │ hash: def...    │         │ hash: ghi...    │
│ locked: false   │         │ locked: false   │         │ locked: true    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

- Every block contains a SHA-256 hash of its content + the previous block's hash
- Mutating any block breaks the entire chain — instantly detectable
- Exam is **locked on chain** before students begin — no modifications possible after

---

## 📐 Score Normalization

Raw scores are weighted by difficulty then normalized across the cohort:

```
Weighted Score = Σ (correct_i × difficulty_i) / Σ difficulty_i × 100

Normalized Score = ((raw - mean) / std_deviation) × 15 + 50
```

This ensures a student who answers harder questions correctly is rewarded fairly, and scores are comparable across different exam sets.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind-inspired inline CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas via Mongoose |
| AI/LLM | OpenRouter API (gpt-oss-120b model) |
| Hashing | Node.js built-in `crypto` (SHA-256) |
| Deployment | Vercel (client) + Railway (server) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenRouter API key (openrouter.ai)

### 1. Clone the repo
```bash
git clone https://github.com/CoolSpidey89/examchain.git
cd examchain
```

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your credentials:
```
MONGO_URI=your_mongodb_uri_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
```

```bash
node index.js
```

### 3. Setup Client
```bash
cd client
npm install
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
examchain/
├── client/                      # React frontend
│   └── src/
│       ├── App.js               # Routing and nav
│       └── pages/
│           ├── Home.js              # Landing page
│           ├── TeacherDashboard.js  # Question management
│           ├── StudentExam.js       # Exam interface
│           └── Results.js           # Score dashboard
│
└── server/                      # Express backend
    ├── index.js                 # Entry point
    ├── models/
    │   ├── Question.js          # Question + hash chain schema
    │   └── Attempt.js           # Student attempt schema
    ├── routes/
    │   ├── questions.js         # Add, lock, fetch questions
    │   ├── exam.js              # Start exam, submit answers
    │   └── results.js           # Fetch and normalize scores
    └── utils/
        ├── llm.js               # OpenRouter API integration
        ├── hash.js              # SHA-256 hash chain logic
        └── normalize.js         # Score normalization formulas
```

---

## 🎯 Demo Flow

1. **Teacher** adds a question → AI generates 5 variants → stored on hash chain
2. **Teacher** locks the exam → chain is immutable from this point
3. **Student A** logs in → receives Variant 3 → submits answers
4. **Student B** logs in → receives Variant 1 → cannot copy Student A
5. **Results** → difficulty-weighted + normalized scores → grade leaderboard

---

## 🏆 FAR AWAY Hackathon

This project was built for the **Examinations** theme at FAR AWAY 2026, addressing:

- ✅ **Security** — Hash chain integrity + unique variants per student
- ✅ **Fairness** — Difficulty-weighted scoring + cohort normalization
- ✅ **Intelligence** — LLM-powered question variant generation


---
