# Real-Time Event Check-In App

A full-stack real-time event engagement platform where users can browse upcoming events, check in, and see live attendee updates. Built with React Native (Expo), Node.js, GraphQL, Prisma, PostgreSQL, and Socket.io.

---

## Features
- View a list of upcoming events
- Join or leave events
- Instantly see who else has joined (real-time attendee updates)
- Live participant count
- Responsive, modern UI
- Mock authentication (choose from demo users)

---

## Tech Stack
- **Frontend:** React Native (Expo), TypeScript, Zustand, TanStack Query, Apollo Client, Socket.io-client
- **Backend:** Node.js, TypeScript, Express, Apollo Server, GraphQL, Prisma, Socket.io
- **Database:** PostgreSQL (via Docker)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

> **⚠️ WARNING:**
> Make sure port **5432** (the default PostgreSQL port) is free before running `docker compose up -d`.
> If you have another PostgreSQL instance or service using this port, stop it or change the port in `docker-compose.yml`.

### 1. Clone the Repository
```sh
git clone https://github.com/dilpreet579/event-checkin-app.git
cd event-checkin-app
```

### 2. Start the Database
```sh
docker compose up -d
```

### 3. Set Up the Backend
```sh
cd backend
npm install
# Set DATABASE_URL in .env if not already set
npx prisma migrate dev --name init
npx prisma generate
npx ts-node src/seed.ts   # Seed the database with demo users/events
npm run dev               # Start the backend server (http://localhost:4000/graphql)
```

### 4. Set Up the Frontend
```sh
cd ../frontend
npm install
npm start                 # Start the Expo app
```
- Open the app in your browser, Android, or iOS device using the Expo QR code or emulator.

---

## Example Credentials (for Login)
You can log in as any of these demo users:

| Name    | Email                |
|---------|----------------------|
| Alice   | alice@example.com    |
| Bob     | bob@example.com      |
| Charlie | charlie@example.com  |
| Diana   | diana@example.com    |
| Eve     | eve@example.com      |
| Frank   | frank@example.com    |
| Grace   | grace@example.com    |

Just tap a user on the login screen or enter their email.

---

## Project Structure
```
Real-Time Event Check-In App/
├── backend/      # Node.js, GraphQL, Prisma, Socket.io
├── frontend/     # React Native (Expo)
├── docker-compose.yml
└── README.md
```

---

## Real-Time Features
- When a user joins or leaves an event, all users viewing that event see the attendee list update instantly (via Socket.io).
- Participant count updates in real time.

---

## Customization & Extending
- Add more users/events in `backend/src/seed.ts`.
- UI can be further polished using a UI library (e.g., react-native-paper).
- For production, replace mock authentication with real auth (JWT, OAuth, etc).

---

## License
MIT 