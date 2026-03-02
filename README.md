# Full-Stack Inventory & Benchmarking Dashboard

A full-stack web application built to streamline custom PC building operations by tracking hardware inventory, logging client builds, and analyzing thermal benchmark data. Built to replace manual spreadsheet workflows with a centralized, data-driven dashboard.

## 📸 Project Showcase

### Executive Dashboard
Centralized hub tracking over $64,000 in inventory value and 40+ client build volumes, featuring quick-access cards for recently assembled and shipped configurations.

> **[DRAG_AND_DROP_DASHBOARD_SCREENSHOT_HERE]**

### Interactive Thermal Analytics
Data visualization built with Recharts. Features a custom control panel to dynamically filter, isolate, and compare peak CPU/GPU load temperatures across specific client builds to identify hardware performance trends.

> **[DRAG_AND_DROP_BENCHMARKS_SCREENSHOT_HERE]**

### Dynamic Inventory Management
Real-time data table connected to a PostgreSQL database, featuring live category filtering, multi-directional sorting, and stock status indicators for 50+ high-end PC components.

> **[DRAG_AND_DROP_INVENTORY_SCREENSHOT_HERE]**

## 🚀 Features

- **Live Inventory Management**: Track hardware components and live stock levels.
- **Client Build Logging**: Assemble custom configurations and calculate costs.
- **Thermal Analytics**: Interactive data visualization of CPU/GPU peak load temperatures to surface performance trends and guide cooler selection.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (node-postgres)

## ⚙️ How to Run Locally

### 1. Database Setup (PostgreSQL)

Create a database named `pc_build_dashboard` and run the SQL script provided in the backend to generate the schemas.

### 2. Backend Environment Setup

Create a `.env` file in the `/backend` folder:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pc_build_dashboard"
```

### 3. Start the Application

You will need two terminal windows to run both servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser to view the application.