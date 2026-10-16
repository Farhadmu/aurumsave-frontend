# AurumSave — Frontend Client

> **AurumSave** is a premium digital gold savings and physical bullion custody platform engineered for Bangladesh. This repository contains the Next.js 14 frontend application.

## 🚀 Key Features

- **Next.js 14 App Router:** Modern server and client components architecture.
- **BAJUS Live Rates Widget:** Real-time ticker and charts for 24K, 22K, 21K, and 18K gold.
- **Gold Calculator & Quotes:** 5-minute guaranteed rate lock purchase/sell simulator.
- **Multi-Role Portals:** Unified portal for Customers and Staff (Admin, KYC Compliance, Operations, Support, Auditor).
- **Fast Role Switcher:** One-click demo credential switcher on `/login` for seamless evaluation.
- **Tailwind CSS & Framer Motion:** Luxury fintech design system with fluid micro-animations.

---

## 🛠️ Quickstart Guide

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Backend API running on `http://localhost:4000/api/v1` (from [aurumsave-backend](https://github.com/Farhadmu/aurumsave-backend))

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Farhadmu/aurumsave-frontend.git
cd aurumsave-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Running Locally

```bash
# Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Production Build & Docker

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or using Docker
docker build -t aurumsave-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 aurumsave-frontend
```

---

## 📜 Pre-Seeded Evaluation Accounts

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Demo Customer** | `customer@aurumsave.com` | `Aurum#Customer2026!` |
| **Super Administrator** | `superadmin@aurumsave.com` | `Aurum#SuperAdmin2026!` |
| **KYC / Compliance Officer** | `compliance@aurumsave.com` | `Aurum#Compliance2026!` |
| **Finance / Operations Officer**| `finance@aurumsave.com` | `Aurum#Finance2026!` |
| **Customer Support Agent** | `support@aurumsave.com` | `Aurum#Support2026!` |
| **External Auditor (Read-Only)**| `auditor@aurumsave.com` | `Aurum#Auditor2026!` |
