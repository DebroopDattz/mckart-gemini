---

# 🛒 McKart – Campus E-Commerce Platform

McKart (College Kart) is a *full-stack e-commerce web application* designed exclusively for a college environment. It enables university students to *buy and sell academic and campus-use items* while offering modern features such as *real-time chat* and an *AI-powered assistant* for enhanced user interaction.

---

## 🚀 Project Overview

In college campuses, students often rely on informal channels to exchange books, notes, stationery, and academic tools. McKart provides a *centralized, digital marketplace* tailored specifically for university students, enabling structured peer-to-peer transactions with a simple, intuitive interface.

---

## ✨ Key Features

* 🔐 *User Authentication* (Login & Registration)
* 🧑‍🎓 *Buyer Dashboard* for browsing available items
* 🧑‍💼 *Seller Dashboard* for managing product listings
* 💬 *Real-Time User-to-User Chat*
* 🤖 *AI Assistant (Ask Gemini)* for guidance and queries
* 📦 *Item Management* (Create, View, Update, Delete)
* 🖼️ *Image Upload Support* for item listings
* ⚡ *Fast, lightweight, and campus-focused design*

---

## 🛠️ Tech Stack

### Frontend

* *Framework:* React (Vite)
* *Styling:* Tailwind CSS
* *Icons:* Lucide React
* *Routing:* React Router DOM
* *State Management:* React Hooks (useState, useEffect)

### Backend

* *Runtime:* Node.js
* *Framework:* Express.js
* *Database:* SQLite (sqlite, sqlite3)
* *Authentication:* JWT, bcryptjs
* *File Uploads:* Multer
* *AI Integration:* Google Generative AI SDK (@google/generative-ai)

---

## 📂 Project Structure


mckart/
│
├── backend/
│   ├── server.js            # Express app entry point
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── items.js          # Item CRUD operations
│   │   ├── chat.js           # User-to-user chat
│   │   └── ai.js             # Gemini AI integration
│   ├── mckart.db             # SQLite database
│   ├── uploads/              # Uploaded images
│   └── .env                  # Environment variables
│
├── src/
│   ├── App.jsx               # Main application component
│   ├── components/
│   │   ├── AuthPage.jsx
│   │   ├── BuyerDashboard.jsx
│   │   ├── SellerDashboard.jsx
│   │   ├── ChatWidget.jsx
│   │   ├── AIChatWidget.jsx
│   │   └── Navbar.jsx
│
└── README.md


---

## 🔄 Application Flow

### 🔑 User Authentication

1. User registers/logs in via *AuthPage*
2. Backend verifies credentials
3. JWT token is issued and stored in localStorage
4. User is redirected to Buyer or Seller Dashboard

---

### 🤖 Ask Gemini (AI Assistant)

1. User opens the *AIChatWidget*
2. Sends a question
3. Frontend sends a POST request to /api/gemini/chat
4. Backend interacts with *Google Gemini API*
5. AI response is displayed in the UI

---

### 🛍️ Buying & Selling Items

* Sellers can list items with images and descriptions
* Buyers can browse items and initiate chats
* All item data is stored and retrieved from SQLite

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

bash
git clone https://github.com/your-username/mckart.git
cd mckart


### 2️⃣ Backend Setup

bash
cd backend
npm install


Create a .env file:

env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret


Start the backend:

bash
node server.js


---

### 3️⃣ Frontend Setup

bash
cd src
npm install
npm run dev


---

## 🔐 Environment Variables

| Variable         | Description               |
| ---------------- | ------------------------- |
| PORT           | Backend server port       |
| GEMINI_API_KEY | Google Gemini API key     |
| JWT_SECRET     | JWT authentication secret |

---

## 🎯 Use Cases

* Buying and selling *books, notes, stationery*
* Peer-to-peer interaction within campus
* AI-powered assistance for queries
* Academic project, hackathon, or startup prototype

---

## 📌 Future Enhancements

* Payment gateway integration
* Campus email verification
* Admin moderation panel
* Advanced search & filtering
* Mobile responsiveness improvements

---

## 🏆 Hackathon Readiness

* ✅ Real-world problem
* ✅ Working prototype
* ✅ AI integration
* ✅ Clean architecture
* ✅ Scalable design

---

## 📜 License

This project is developed for *academic and prototype purposes*.
You are free to modify and extend it for educational use.

---
