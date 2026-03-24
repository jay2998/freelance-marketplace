# 🛍️ FreelanceHub — Freelance Marketplace

A full-stack freelance marketplace web app inspired by Fiverr. Sellers can post gigs, buyers can browse and order services, and both can leave reviews.

🔗 **Live Demo**: [https://freelance-marketplace-l9z9.vercel.app](https://freelance-marketplace-l9z9.vercel.app)

---

## ✨ Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 👤 Seller & Buyer roles
- 📦 Gig creation with Cloudinary image uploads
- 🔍 Search and filter gigs by category
- ⭐ Reviews and star ratings
- 🛒 Order placement and management
- 📊 Seller dashboard with stats
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS v4
- Zustand (state management)
- Axios
- React Router DOM
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Cloudinary (image uploads)

---

## 📁 Project Structure
```
freelance-marketplace/
├── frontend/          # React + Vite app
│   └── src/
│       ├── api/       # Axios instance
│       ├── components/# Navbar, GigCard, ProtectedRoute
│       ├── pages/     # All pages
│       └── store/     # Zustand auth store
└── backend/           # Node.js + Express API
    ├── controllers/   # Route logic
    ├── middleware/    # JWT verification
    ├── models/        # MongoDB schemas
    └── routes/        # API routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### Clone the repo
```bash
git clone https://github.com/jay2998/freelance-marketplace.git
cd freelance-marketplace
```

### Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
```bash
npm run dev
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

- **Frontend** → Vercel
- **Backend** → Railway
- **Database** → MongoDB Atlas
- **Images** → Cloudinary

---

## 👨‍💻 Author

**Jahangir Ali** — Junior Frontend Developer at Infinity Bytes, Lahore
- GitHub: [@jay2998](https://github.com/jay2998)
- Portfolio: [jahangir-portfolio.vercel.app](https://jahangir-portfolio.vercel.app)