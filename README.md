# 🌩️ Snap Storm

A modern GitHub-like full-stack project built with **React**, **Node.js**, **MongoDB**, and **AWS S3**, allowing users to create repositories, push versioned files, manage commits, and browse code history—just like Git, but custom built!

---

### 🚀 Live Preview

> Coming Soon...

---

## 📸 Demo Preview (GIF/Screenshots)

> *You can upload GIFs or screenshots here showing repository creation, file push, viewing commits, etc.*

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

* ✅ User authentication (JWT + LocalStorage)
* ✅ Create public or private repositories
* ✅ Upload files with commit messages (like Git)
* ✅ View all previous versions of any file
* ✅ Each file version is uniquely commit-stamped
* ✅ All files stored safely on **AWS S3**
* ✅ File explorer UI with code preview
* ✅ Commit history and message display
* ✅ Issue system (basic integration with `Issue` model)
* ✅ Responsive dark-themed UI using Tailwind CSS
* ✅ Neon animated particle background

---

## 📦 Tech Stack

### Frontend:

* ⚛️ React.js + React Router
* 💨 Tailwind CSS
* 🧠 Zustand (for future state mgmt)
* 🎨 Lucide Icons
* 🌈 Particles.js (for animated background)

### Backend:

* 🟢 Node.js + Express
* 🌐 MongoDB + Mongoose
* 🧾 Multer (for file upload handling)
* ☁️ AWS S3 SDK (for cloud storage)

---

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
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
└── README.md
```

---


## 📌 Future Improvements

* ✅ Better UI for commit diffs
* ✅ User profile pages with contribution graph
* 🔐 OAuth login via GitHub or Google
* 🔍 Full-text file search
* 📁 Directory view like GitHub
* 🐛 Advanced Issue tracking system
* 🧪 Unit + Integration testing (Jest / Supertest)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and open a PR with improvements, bug fixes, or new features.

---

## 📄 License

MIT License © 2025 [@PAMBAK-AAT](https://github.com/PAMBAK-AAT)

---

## 📬 Contact

If you have any questions or suggestions:
📧 **Arshad** – [github.com/PAMBAK-AAT](https://github.com/PAMBAK-AAT)
