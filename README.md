# 📝 Todo Application (MERN Stack)

A full-stack Todo app built with **React (Vite)**, **Node.js (Express)**, and **MongoDB Atlas**.

---

## 🚀 Features

* Add, delete, and update todos
* Mark todos as completed
* Add notes to each todo (using MongoDB aggregation)
* Infinite scroll with pagination
* Backend API with MongoDB Atlas
* Clean and responsive UI

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas (Cloud Database)
* Mongoose

---

## 📁 Project Structure

```
todo-app/
│
├── client/      # React Frontend (Vite)
├── server/      # Node.js Backend
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

---

## 🖥 Frontend Setup (React + Vite)

```bash
cd client
npm install
npm run dev
```

👉 Runs on: http://localhost:5173

---

## 🔧 Backend Setup (Node + Express)

```bash
cd server
npm install
npm start
```

👉 Runs on: http://localhost:3000

---

## 🌐 MongoDB Atlas Setup

1. Go to https://www.mongodb.com/
2. Create a free cluster
3. Create a database user
4. Allow your IP (or allow all for development)
5. Copy your connection string

Example:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

6. Paste it in your backend (`server/app.js`):

```js
mongoose.connect("YOUR_MONGODB_ATLAS_URI")
```

---

## 🔗 API Endpoints

### Todos

* GET /todos
* POST /todos
* PUT /todos/:id
* DELETE /todos/:id

### Notes

* POST /notes

### Aggregated

* GET /todos-with-notes?limit=5&skip=0

---

## 👩‍💻 Author

Anisha Das

---

## ⭐ Contribute

Feel free to fork this repo and improve it!
