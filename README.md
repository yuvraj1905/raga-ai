# Raga-ai — Healthcare Management Platform

A modern B2B healthcare SaaS frontend built with React 19, TypeScript, Vite, Tailwind CSS v4, and Firebase Authentication.

## Features

- 🔐 **Firebase Authentication** — email/password login with session persistence
- 📊 **Dashboard** — real-time stats, recent activity, critical patient alerts
- 👥 **Patients** — grid & list views with search, filter, and add patient flow
- 📈 **Analytics** — trends charts, department breakdown, age distribution
- 🔔 **Push Notifications** — service worker + browser notification API
- 📱 **Responsive** — works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 6 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Routing | React Router v7 |
| Auth | Firebase v11 |
| Forms | react-hook-form + Zod |
| Charts | Recharts |
| Icons | lucide-react |

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd healthos
npm install
```

### 2. Configure Firebase

```bash
cp .env.example .env
```

Fill in your Firebase project credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

You can get these from the [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps.

### 3. Enable Email/Password auth in Firebase

Firebase Console → Authentication → Sign-in method → Email/Password → Enable

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

### 5. Demo mode

Without Firebase configured, use the demo credentials shown on the login page:
- Email: `demo@healthos.app`
- Password: `demo123`

## Project Structure

```
src/
├── app/
│   ├── providers/    # AuthProvider
│   └── router/       # AppRouter, ProtectedRoute
├── features/
│   ├── auth/         # Login page, useAuth, Firebase service, auth store
│   ├── dashboard/    # Dashboard page, NotificationPanel
│   ├── analytics/    # Analytics page with Recharts
│   └── patients/     # Grid/list views, modals, patients store
├── shared/
│   ├── components/   # AppLayout, Sidebar, MobileNav
│   │   └── ui/       # Button, Card, Badge, Input, Modal, Avatar, etc.
│   ├── hooks/        # useNotifications
│   ├── types/        # TypeScript interfaces
│   └── constants/    # Mock data (patients, stats, analytics)
└── styles/
    └── globals.css   # Tailwind v4 + font setup
```

## Push Notifications

The app registers a service worker (`/sw.js`) on load. To test notifications:

1. Go to Dashboard
2. Click **Notifications** button
3. Click **Enable Notifications** (browser will prompt for permission)
4. Use the **Simulate** buttons to trigger test notifications
