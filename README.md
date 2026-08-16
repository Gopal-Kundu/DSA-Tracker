# ⚡ DSA Tracker & Revision Sheet (with AI Help)

> **Track DSA problems from LeetCode, Codeforces, CodeChef, and GeeksforGeeks, master coding interviews with AI-driven time complexity analysis, and retain solutions using Spaced Repetition.**

---

## 🌟 Overview

**DSA Tracker** is a modern, high-performance web application designed for software engineers, students, and competitive programmers preparing for technical coding interviews.

Unlike static spreadsheets, DSA Tracker provides an interactive dashboard with **Google Gemini 3.1 AI Integration**, **Spaced Repetition (SRS) tracking**, **Markdown notes**, and **Dual View Modes (List Table & Folder Grid)**.

---

## 📸 Screenshots

### Landing Page
![Landing Page](frontend/Images/Homepage.png)

### Dashboard Tracker
![Dashboard Tracker](frontend/Images/Tracker%20Page.png)

---

## ✨ Key Features

### 🧠 1. AI-Powered Note Refinement & Time Complexity Analysis
* **Time Complexity Generator:** Get instant **2-line Time & Space Complexity analysis** (Brute Force vs. Optimized approach, Data Structures used) powered by Google Gemini AI.
* **AI Note Refinement:** Clean up raw notes, fix grammar, and structure key takeaways without changing your core logic.
* **One-Click Append ("Add") & Replace:** Seamlessly append AI-generated complexity analysis directly into your existing notes or replace them completely.

### 🔁 2. Spaced Repetition System (SRS)
* **Revision Counter:** Increment/decrement revision counters for every problem to enforce spaced repetition and eliminate knowledge decay before interview day.
* **Solving Time Tracking:** Record exact solving duration (in minutes) to measure your algorithmic speed.

### 🌐 3. Multi-Platform Problem Management
* **Universal Problem Support:** Save, categorize, and track questions from **LeetCode**, **Codeforces**, **CodeChef**, **GeeksforGeeks**, **HackerRank**, and custom sources.
* **YouTube Explanation Embeds:** Link video solution walkthroughs directly to any question row for 1-click reference.

### 📁 4. Dual Workspace Views
* **Interactive List Table:** Sleek table view displaying Status (checkbox), Problem Title with direct external links, Topic Badges, Difficulty Tags, Solving Time, SRS Counters, and Note buttons.
* **Topic Folder Grid:** Visual folder cards grouping problems by topic with real-time completion progress bars and Easy/Medium/Hard difficulty breakdowns.

### 📝 5. Markdown Note Editor & Renderer
* **Markdown Support:** Write notes using standard Markdown formatting (`# Headings`, `**bold**`, lists, inline `code`, and preformatted code blocks).
* **React Markdown Rendering:** Dynamic, formatted rendering for both user notes and AI-generated outputs.

### 🔍 6. Smart Filtering & Instant Search
* **Real-time Client-side Search:** Instant lookup by problem name or topic.
* **Multi-Filter & Sorting:** Filter by Topic, Difficulty (Easy, Medium, Hard), or Solved Status. Sort by Title, Time Taken, Revision Count, or Difficulty rank.

### 🔒 7. Secure Authentication & User Isolation
* **Private Account Data:** User data is strictly isolated per account using JWT & HTTP-only cookies.
* **Safety Reset Modals:** 1-click confirmation modals for safely resetting progress.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide React (Icons), React Markdown, Redux Toolkit |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Cookie Parser |
| **Database** | MongoDB Atlas |
| **AI Engine** | Google Generative AI (`@google/generative-ai` - Gemini 3.1 Flash / Lite) |
| **Package Manager** | `pnpm` (or `npm`) |

---

## 📂 Project Structure

```text
DSA Sheet/
├── backend/
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Business logic & AI controller (questionController.js, authController.js)
│   ├── middleware/           # JWT auth middleware (authMiddleware.js)
│   ├── models/               # MongoDB Schemas (User.js, Question.js)
│   ├── routes/               # Express API routes (questionRoutes.js, authRoutes.js)
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express app entry point
│
└── frontend/
    ├── public/               # Static assets & favicon
    ├── src/
    │   ├── components/       # UI Components (LandingView, QuestionTable, FolderView, FilterToolbar, Navbar, etc.)
    │   │   └── modals/       # Modals (NotesModal, AddQuestionModal, EditQuestionModal, ResetModal)
    │   ├── config.js         # API baseURL configuration
    │   ├── App.jsx           # Main Application Container & Router
    │   ├── index.css         # Modern Cyber Obsidian Design System
    │   └── main.jsx          # React DOM Entrypoint
    ├── package.json          # Frontend dependencies
    └── vite.config.js        # Vite configuration & proxy settings
```

---

## ⚙️ Environment Configuration

### Backend Setup (`backend/.env`)

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dsatracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173

# Google Gemini AI Key (Required for AI Time Complexity & Note Refine)
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **pnpm** (recommended) or **npm**
* **MongoDB** (Local instance or MongoDB Atlas Cluster)
* **Google Gemini API Key** (Free tier available at [Google AI Studio](https://aistudio.google.com/))

---

### Installation & Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/dsa-tracker.git
cd dsa-tracker
```

#### 2. Install Backend Dependencies
```bash
cd backend
pnpm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
pnpm install
```

---

### Running the Application

#### Start the Backend Server (Port 5000)
```bash
cd backend
pnpm run dev
```

#### Start the Frontend Server (Port 5173)
Open a new terminal window:
```bash
cd frontend
pnpm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔌 API Endpoints Summary

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new account |
| `POST` | `/api/auth/login` | Login user & receive HTTP cookie |
| `POST` | `/api/auth/logout` | Logout user & clear session |
| `GET` | `/api/auth/me` | Fetch current logged-in user |

### Question Routes (`/api/questions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/questions` | Get all questions for logged-in user |
| `POST` | `/api/questions` | Add a new question |
| `PUT` | `/api/questions/:id` | Update question details (status, notes, revisions, time) |
| `DELETE` | `/api/questions/:id` | Delete a question |
| `POST` | `/api/questions/refine-note` | **AI Endpoint:** Generate 2-line Time Complexity or refine raw notes |
| `POST` | `/api/questions/reset` | Reset user sheet progress |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

---

## 📄 License

This project is licensed under the **MIT License**.
