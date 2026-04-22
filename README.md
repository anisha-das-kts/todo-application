# 📝 Todo Application (MERN + Firebase Auth)

A full-stack Todo application built with **React (Vite)**, **Node.js (Express)**, and **MongoDB Atlas**, featuring **Google Authentication**, **user-specific data**, and **infinite scroll pagination**.

---

## 🚀 Features

### 🔐 Authentication
- Google Login using Firebase Authentication
- Secure API access using Bearer Token
- Each user has their own private todos

### ✅ Todo Management
- Add, delete, and update todos
- Mark todos as completed
- Data persists per user

### 📝 Notes System
- Add notes to each todo
- Uses MongoDB **Aggregation Pipeline ($lookup)**

### ♾ Pagination & Infinite Scroll
- Loads todos in batches (limit = 5)
- Auto-load more on scroll
- Efficient backend pagination with `skip` and `limit`

### 🎯 UI/UX
- Clean responsive UI
- User profile (name & email) display
- Loading indicators

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Firebase Authentication
- JavaScript (ES6+)
- CSS

### Backend
- Node.js
- Express.js
- Middleware-based authentication

### Database
- MongoDB Atlas (Cloud)
- Mongoose
- Aggregation Framework

---

## 📁 Project Structure
todo-app/
│
├── client/ # React Frontend
├── server/ # Node.js Backend
├── .gitignore
└── README.md

---

## ⚙️ Setup Instructions

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/anisha-das-kts/todo-application.git
cd todo-application

🖥 Frontend Setup (React + Firebase)
cd client
npm install
npm run dev
👉 Runs on: http://localhost:5173

🔥 Firebase Setup
Go to https://console.firebase.google.com/
Create a project
Enable Google Authentication
Go to Project Settings → Web App
Copy config and create:
client/src/firebase.jsx

Example:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};
🔧 Backend Setup (Node + Express)
cd server
npm install
npm start

👉 Runs on: http://localhost:3000

🌐 MongoDB Atlas Setup
Go to https://www.mongodb.com/
Create cluster
Create DB user
Allow IP access
Copy connection string
🔐 Environment Variables

Create a .env file inside server/:

MONGO_URI=your_mongodb_connection_string
🔗 API Endpoints
🔐 Protected Routes (Require Token)

All APIs require:

Authorization: Bearer <token>
Todos
GET /todos-with-notes?limit=5&skip=0
POST /todos
PUT /todos/:id
DELETE /todos/:id
Notes
POST /notes
⚙️ Key Concepts Used
🔗 MongoDB Aggregation
{
  $lookup: {
    from: "notes",
    localField: "_id",
    foreignField: "todoId",
    as: "notes"
  }
}
🔐 Auth Middleware
Verifies Firebase token
Creates user if not exists
Attaches req.user
♾ Pagination Logic
skip + result.length < totalCount
👩‍💻 Author

Anisha Das

⭐ Contribute

Feel free to fork this repo and improve it!

🚀 Future Improvements
Edit notes feature
Profile page
Dark mode
Deployment (Vercel + Render)

---

# 🔥 WHAT YOU JUST DID

Your README is now:

✔ Portfolio-ready  
✔ Interview-ready  
✔ Explains auth + aggregation  
✔ Shows real-world architecture  

---

# 🚀 FINAL STEP

Push it:

```bash
git add README.md
git commit -m "Updated README with Firebase auth and user-based features"
git push origin main