# 🚗 DesiRent — India's #1 Car Rental Platform

> **"Book a car online like Uber but for rentals"**

A full-stack, production-ready car rental web application built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express + Prisma + PostgreSQL** (backend). Designed for the **Indian market** with a focus on **Noida, Sector 37** and Delhi NCR.

---

## 📸 Screenshots

- 🏠 Hero section with search bar
- 🚗 20 cars (15 Standard + 5 Luxury) with real images
- 📋 Multi-step booking system (like Uber)
- 🔐 Login/Register with Admin & User roles
- 🗺️ Popular destinations from Noida
- 💳 Razorpay payment integration (backend)
- 📊 Admin dashboard with analytics

---

## 🚀 How to Run on Localhost (VS Code)

### ✅ Prerequisites

Make sure you have these installed on your computer:

| Tool | Version | Download Link |
|------|---------|--------------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Chrome** | Latest | [google.com/chrome](https://www.google.com/chrome/) |

### 📂 Step 1: Open Project in VS Code

```bash
# Open VS Code, then open the project folder
# OR use terminal:
cd path/to/desirent
code .
```

### 📦 Step 2: Install Dependencies (Frontend)

Open **VS Code Terminal** (`Ctrl + `` ` `` ` or `View → Terminal`):

```bash
# Install all frontend dependencies
npm install
```

### ▶️ Step 3: Start the Dev Server

```bash
# Start Vite development server
npm run dev
```

You'll see output like:
```
  VITE v6.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 🌐 Step 4: Open in Chrome

1. Open **Google Chrome**
2. Go to: **`http://localhost:5173`**
3. 🎉 Your DesiRent website is now running!

### 🔄 Live Reload

- Any changes you make to the code will **automatically refresh** in Chrome
- No need to restart the server

---

## 🏗️ Running the Backend (Full-Stack Mode)

### 📦 Step 1: Install Backend Dependencies

```bash
# Navigate to server folder
cd server

# Install backend dependencies
npm install
```

### 🗄️ Step 2: Setup Database

You need **PostgreSQL** installed:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql`

```bash
# Create a new database
createdb desirent_db

# Copy environment file
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/desirent_db"
JWT_SECRET="your-super-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 🔄 Step 3: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### ▶️ Step 4: Start Backend Server

```bash
# Start the backend server
npm run dev
```

Backend will run on: **`http://localhost:5000`**

### 🔗 Step 5: Run Both Together

Open **two terminals** in VS Code:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

Now open Chrome: **`http://localhost:5173`** — Full-stack DesiRent is running! 🚀

---

## 📁 Project Structure

```
desirent/
├── 📂 public/
│   └── 📂 images/
│       └── 📂 cars/           # AI-generated car images
│           ├── swift-white.jpg
│           ├── creta-silver.jpg
│           ├── nexon-blue.jpg
│           ├── fortuner-white.jpg
│           └── mercedes-eclass.jpg
│
├── 📂 src/                    # Frontend (React + Vite)
│   ├── 📂 components/
│   │   ├── Navbar.tsx         # Navigation with auth
│   │   ├── HeroSection.tsx    # Hero with search
│   │   ├── CarCard.tsx        # Car card with smart image loader
│   │   ├── BookingModal.tsx   # 3-step Uber-like booking
│   │   ├── AuthModal.tsx      # Login/Register modal
│   │   ├── AdminDashboard.tsx # Admin panel
│   │   ├── UserDashboard.tsx  # User bookings & profile
│   │   ├── AboutSection.tsx   # About page
│   │   ├── ContactSection.tsx # Contact with OpenStreetMap
│   │   ├── DestinationsSection.tsx  # Popular destinations
│   │   ├── Footer.tsx         # Footer
│   │   └── BackendDocs.tsx    # Interactive backend docs
│   │
│   ├── 📂 context/
│   │   └── AuthContext.tsx    # Auth state management
│   │
│   ├── 📂 data/
│   │   └── cars.ts            # 20 cars data (15 Standard + 5 Luxury)
│   │
│   ├── 📂 db/
│   │   └── database.ts        # localStorage database engine
│   │
│   ├── 📂 utils/
│   │   └── cn.ts              # Tailwind class merger
│   │
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind imports
│
├── 📂 server/                 # Backend (Node.js + Express)
│   ├── 📂 prisma/
│   │   └── schema.prisma      # Database schema (8 models)
│   │
│   ├── 📂 src/
│   │   ├── index.ts           # Express server entry
│   │   ├── 📂 routes/
│   │   │   ├── auth.ts        # Auth endpoints (register, login, OTP)
│   │   │   ├── bookings.ts    # Booking CRUD + pricing
│   │   │   ├── cars.ts        # Car fleet management
│   │   │   └── payments.ts    # Razorpay integration
│   │   └── 📂 middleware/
│   │       └── auth.ts        # JWT verification middleware
│   │
│   ├── .env.example           # Environment variables template
│   └── package.json           # Backend dependencies
│
├── index.html                 # HTML entry point
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | `admin@desirent.in` | `admin123` |
| 👤 **User** | `rahul@gmail.com` | `user123` |
| 👤 **User** | `priya@gmail.com` | `priya123` |

---

## 🚗 Car Fleet (20 Cars)

### Standard Fleet (15 Cars)
| # | Car | Category | Price/Day | Fuel |
|---|-----|----------|-----------|------|
| 1 | Maruti Suzuki Swift | Hatchback | ₹1,500 | Petrol |
| 2 | Hyundai i20 | Hatchback | ₹1,700 | Petrol |
| 3 | Tata Altroz | Hatchback | ₹1,600 | Petrol |
| 4 | Maruti Suzuki Dzire | Sedan | ₹1,800 | CNG |
| 5 | Honda City | Sedan | ₹2,000 | Petrol |
| 6 | Hyundai Verna | Sedan | ₹2,200 | Petrol |
| 7 | Mahindra Thar | SUV | ₹3,000 | Diesel |
| 8 | Hyundai Creta | SUV | ₹2,500 | Diesel |
| 9 | Kia Seltos | SUV | ₹2,600 | Petrol |
| 10 | Mahindra Scorpio-N | SUV | ₹3,200 | Diesel |
| 11 | Toyota Innova Crysta | MUV | ₹4,000 | Diesel |
| 12 | Maruti Suzuki Ertiga | MUV | ₹2,800 | CNG |
| 13 | Mahindra XUV700 | Premium SUV | ₹3,500 | Diesel |
| 14 | Tata Nexon | SUV | ₹2,200 | Petrol |
| 15 | Toyota Fortuner | Premium SUV | ₹5,500 | Diesel |

### Luxury Fleet (5 Cars)
| # | Car | Category | Price/Day | Fuel |
|---|-----|----------|-----------|------|
| 16 | Mercedes-Benz E-Class | Luxury Sedan | ₹12,000 | Petrol |
| 17 | BMW 5 Series | Luxury Sedan | ₹13,500 | Petrol |
| 18 | Audi A6 | Luxury Sedan | ₹14,000 | Petrol |
| 19 | Jaguar XF | Luxury Sedan | ₹15,000 | Petrol |
| 20 | Range Rover Velar | Luxury SUV | ₹18,000 | Petrol |

---

## 🛠️ Tech Stack

### Frontend
- ⚡ **Vite** — Lightning-fast dev server
- ⚛️ **React 18** — Component-based UI
- 🎨 **Tailwind CSS** — Utility-first styling
- 📦 **TypeScript** — Type safety
- 🎯 **Lucide React** — Beautiful icons

### Backend
- 🟢 **Node.js** — Runtime
- 🚂 **Express** — Web framework
- 🗄️ **Prisma** — ORM for PostgreSQL
- 🐘 **PostgreSQL** — Database
- 🔐 **JWT** — Authentication
- 💳 **Razorpay** — Payment gateway

---

## 📞 Contact (Demo Data)

- 📍 **Address**: Sector 37, Noida, Uttar Pradesh, India - 201303
- 📞 **Phone**: +91 98765 43210
- 📧 **Email**: support@desirent.in
- 🌐 **Website**: desirent.in

---

## 📄 License

MIT License © 2024 DesiRent

---

**Made with ❤️ in India 🇮🇳**
