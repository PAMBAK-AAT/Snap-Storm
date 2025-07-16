# 🌩️ Snap Storm

A modern GitHub-like full-stack project built with **React**, **Node.js**, **MongoDB**, and **AWS S3**, allowing users to create repositories, push versioned files, manage commits, and browse code history—just like Git, but custom built!

---

### 🚀 Live Preview
<div align="center">
  <a href="https://snapstorm.netlify.app/"><strong>🌍 Live Project</strong></a> • 
  <a href="https://github.com/PAMBAK-AAT/Snap-Storm"><strong>📁 Source Code</strong></a>
</div>

## 🧩 Overview

**Snap Storm** is a full-stack, GitHub-inspired platform where users can:

- 📂 Create public/private repositories  
- 💾 Upload versioned files with commit messages  
- ⏪ Browse file history across all commits  
- ☁️ Store and retrieve code via AWS S3  
- 🎨 Explore an interactive and visually appealing interface  

It’s a completely custom-built, Git-like system that mimics essential version control functionality for code collaboration, learning, and showcasing purposes.

Core Logic Flow ->

File → Add (Staging) → Commit (Snapshot + message) → Push (to AWS S3)
                              ↓
                     Stored per-commit in:
             s3://snap-storm-bucket/commits/<commitId>/

---

## 🚀 Tech Stack

### Frontend
- ⚛️ React.js + React Router
- 💨 Tailwind CSS (Dark theme, responsive)
- 🎨 Lucide Icons
- 🌌 tsParticles (background animation)
- 🌐 Hosted on Netlify

### Backend
- 🟢 Node.js + Express.js
- 🛢 MongoDB + Mongoose
- ☁️ AWS S3 SDK (secure file storage)
- 🧠 Custom Git-like CLI logic (init, add, commit, push, revert)
- 🌐 Hosted on Render

---

## 📚 Table of Contents

* [🛠️ Features](#️-features)
* [📦 Tech Stack](#-tech-stack)
* [🧑‍💻 Getting Started](#-getting-started)
* [📂 Folder Structure](#-folder-structure)
* [🔒 Security Notes](#-security-notes)
* [📌 Future Improvements](#-future-improvements)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)

---

## 🛠️ Features

- 🔐 JWT-based user authentication
- ✅ Public/private repository creation
- 📤 Upload and commit files with messages
- ⏳ View file versions by commit ID
- ☁️ All data securely stored on AWS S3
- 🔎 Clean file explorer and code preview
- 📝 View commit messages per file
- 🧾 Basic issue system integration
- 🌑 Modern dark-themed UI with glowing particle animation
- 📱 Fully responsive for mobile and desktop


## 🧑‍💻 Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/PAMBAK-AAT/Snap-Storm.git
cd Snap-Storm
```

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

**Create `config/aws-config.js` with this structure:**

```js
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3_BUCKET = process.env.S3_BUCKET;
module.exports = { s3, S3_BUCKET };
```

**Also create `.env` file in backend (NOT TO BE COMMITTED):**

```
MONGO_URI=your_mongodb_uri
PORT=3000
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=ap-south-1
S3_BUCKET=snap-storm-uploads
```

```bash
# Start backend server
node index.js
```

### 2️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in frontend:

```
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## 📂 Folder Structure

```
Snap-Storm/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── .env (not included in repo)
│ └── index.js
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── assets/
│ ├── .env (not included in repo)
│ └── App.jsx
└── README.md

---


📌 Future Roadmap
🔐 OAuth login via Google or GitHub

🔍 Full-text search across files and  adding pull, revert  commands also with issue repo.

📁 GitHub-like directory navigation

📊 User profile stats (contribution graph)

🐞 Enhanced issue tracking with filters

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and open a PR with improvements, bug fixes, or new features.

---

## 📄 License

MIT License © 2025 [@PAMBAK-AAT](https://github.com/PAMBAK-AAT)

---

📬 Contact
Arshad
📫 github.com/PAMBAK-AAT
🌍 Live Demo
