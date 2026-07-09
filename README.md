<div align="center">
  <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=300&fit=crop&auto=format" alt="DesiRent Banner" style="border-radius: 15px; margin-bottom: 20px;">
  
  # 🚗 DesiRent (Let's Go) 
  **Premium Car Rental Platform for the Indian Market**
  
  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-Orange?style=for-the-badge" alt="Features"></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-Blue?style=for-the-badge" alt="Tech Stack"></a>
    <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-Green?style=for-the-badge" alt="Architecture"></a>
    <a href="#-getting-started"><img src="https://img.shields.io/badge/Getting_Started-Red?style=for-the-badge" alt="Getting Started"></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  </p>
  
  <i>Seamlessly bridging the gap between luxury and affordability for your next road trip.</i>
</div>

---

## 📖 Overview

**DesiRent** is a full-stack, real-time car rental application built specifically to address the modern needs of the Indian car rental industry. It delivers an incredibly polished, native-like web experience with glassmorphism UI, real-time tracking, an integrated wallet, and comprehensive role-based dashboards.

---

## ✨ Features

### 🤵 For Customers
* **Stunning UI/UX**: Premium dark-mode accents, floating form labels, and hover-scaling glassmorphism cards.
* **Integrated Wallet**: Add funds to a digital wallet and pay for rides seamlessly without external gateways.
* **Smart Promo Codes**: Dynamic discount system to attract more bookings.
* **Real-time Tracking**: Watch your driver approach your location live on an interactive map.

### 🛡️ For Admins
* **Analytics Dashboard**: Live revenue data and user growth visualised using interactive `Recharts`.
* **Exportable Reports**: Generate beautiful `jsPDF` invoices or standard `CSV` spreadsheets with a single click.
* **Fleet Management**: Easily track which cars are booked, available, or out for maintenance.

### 🚕 For Drivers
* **Driver Dashboard**: Simulated driver flow to accept bookings, update trip statuses ("Arrived", "On Trip", "Completed"), and instantly notify the customer.

---

## 🏗️ Architecture

The application follows a modern client-server architecture with real-time WebSocket capabilities. *(Note: Diagram labels are cleanly formatted for GitHub parsing).*

```mermaid
graph TD
    %% Define Styles
    classDef client fill:#f9f9f9,stroke:#e65100,stroke-width:2px,color:#333
    classDef server fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#333
    classDef db fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px,color:#333
    classDef external fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#333

    %% Client Side
    subgraph Client ["Frontend App"]
        UI["User Interface"]:::client
        State["React Context"]:::client
        API_Client["API Service"]:::client
        Socket_Client["Socket.io Client"]:::client
        
        UI --> State
        State --> API_Client
        State --> Socket_Client
    end

    %% Server Side
    subgraph Server ["Backend API"]
        API_Server["Express REST API"]:::server
        Socket_Server["Socket.io Server"]:::server
        Auth_Middleware["JWT Auth"]:::server
        Prisma["Prisma ORM"]:::server
        
        API_Client -->|HTTP / JSON| API_Server
        Socket_Client <-->|WebSockets| Socket_Server
        
        API_Server --> Auth_Middleware
        Auth_Middleware --> Prisma
        Socket_Server --> Prisma
    end

    %% Database
    subgraph DatabaseLayer ["Database"]
        DB[("SQLite / PostgreSQL")]:::db
        Prisma --> DB
    end

    %% External
    Maps["OpenStreetMap"]:::external
    UI -->|Map Tiles| Maps
```

---

## 🔄 Core Workflows

### 1. The Booking Engine
How a user successfully books a car and interacts with the driver in real-time.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant SocketIO
    participant Driver
    
    User->>Frontend: Select Car & Dates
    Frontend->>Frontend: Apply Promo & Wallet Balance
    User->>Frontend: Click "Confirm Booking"
    Frontend->>Backend: POST /api/bookings
    Backend-->>Frontend: Booking Confirmed
    
    Backend->>SocketIO: Emit 'booking:new'
    SocketIO-->>Driver: Notify New Booking
    
    Driver->>Frontend: Update Status (On the way)
    Frontend->>Backend: PUT /api/bookings/:id/status
    Backend->>SocketIO: Emit 'driver:status_update'
    SocketIO-->>User: Show Live Tracking
```

### 2. Admin Analytics
How admins generate reports and view revenue streams.

```mermaid
flowchart LR
    A[Admin] -->|Accesses Dashboard| B(Fetch Analytics)
    B --> C{Prisma Aggregations}
    C --> D["Revenue Data"]
    C --> E["User Growth"]
    C --> F["Booking Status"]
    D --> G["Recharts Component"]
    E --> G
    F --> G
    G -->|Click Export| H["Generate PDF / CSV"]
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rohitsingh910/Car-rental-website.git
   cd Car-rental-website
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="file:./dev.db" # Or your PostgreSQL URL when ready
   JWT_SECRET="your_super_secret_key"
   PORT=5000
   ```

### Running the Platform

**Start the Backend API:**
```bash
# In the /server directory
npm run dev
```

**Start the Frontend App:**
```bash
# In the root directory
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing

The project uses **Vitest** for incredibly fast unit and component testing.

```bash
# Run tests in CLI
npm run test

# Run tests with interactive UI
npm run test -- --ui
```

---

<div align="center">
  <h3>Built with ❤️ for the Indian roads.</h3>
  <p>© 2024 DesiRent</p>
</div>
