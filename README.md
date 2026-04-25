# ZoomLens — Advanced AI Meeting Platform

ZoomLens is an AI-powered, real-time meeting and sales intelligence platform designed to seamlessly integrate video conferencing, live attention tracking, and automated meeting transcription. By leveraging browser-based machine learning, scalable microservices, and modern web technologies, it provides real-time insights into participant engagement alongside robust post-meeting analytics.

## 🚀 Key Features

*   **Real-time AI Attention Tracking**: Runs directly in the browser utilizing TensorFlow.js and `@tensorflow-models/face-landmarks-detection` to analyze user engagement.
*   **Live Video & Screen Sharing**: Built with WebRTC and Socket.io for stable, low-latency audio/video feeds.
*   **Automated Transcriptions & Summaries**: Integrates with Groq API for lightning-fast transcriptions and post-meeting summarization.
*   **Microservices Backend**: A powerful Node.js backend separated into logical units (`api`, `backend`, `ai`, `frontend`) to handle recording, socket events, secure routing, and database interactions.
*   **Secure Authentication**: Unified authentication flow using Firebase Auth.
*   **Interactive Participant Dashboard**: Live metrics, meeting timelines, and dynamic visual indicators of meeting health.

## 💻 Tech Stack

### Frontend
*   **Framework**: Next.js (App Router), React 19
*   **Styling**: Tailwind CSS v4, Framer Motion
*   **State Management**: Zustand
*   **AI/ML**: TensorFlow.js (tfjs-core, webgl)
*   **Real-time**: Socket.io-client

### Backend
*   **Environment**: Node.js, Express.js
*   **Architecture**: Microservices (API Gateway, Backend Services, AI Engine)
*   **Database**: Firebase Admin (Firestore)
*   **WebSockets**: Socket.io

---

## 🛠️ Getting Started & Installation Process

Because ZoomLens uses a modular microservices architecture, you must install dependencies for each module independently.

### 1. Clone the Repository
```bash
git clone https://github.com/madhan-3056/zoom.git
cd zoom
```

### 2. Install Dependencies
Run these commands from the root folder sequentially:

```bash
# Install Frontend UI
cd frontend && npm install && cd ..

# Install Backend Services
cd backend && npm install && cd ..

# Install API Gateway
cd api && npm install && cd ..

# Install AI Engine 
cd ai && npm install && cd ..
```

### 3. Environment Configuration
You need to configure the `.env` files for the frontend and backend.

**Backend Configuration (`backend/.env`):**
Navigate to the `backend/` directory and create a `.env` file:
```env
PORT=3002
GROQ_API_KEY=your_groq_api_key_here
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Frontend Configuration (`frontend/.env.local`):**
Navigate to the `frontend/` directory and create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_WS_URL=http://localhost:3002
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running the Application
To run the full stack locally, open two separate terminal windows from the root directory:

**Terminal 1 (API Gateway & Backend):**
```bash
cd api
npm run start
```
*(This starts the backend on port 3002, connecting the WebSocket and AI routing).*

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
*(This starts the Next.js application on port 3000).*

---

## 🏗️ Project Structure

```
zoom/
├── api/                   # API Gateway (Express Entrypoint)
├── backend/               # Core Node.js Services (Auth, Meetings, Realtime)
├── ai/                    # AI Engine (Groq Integration)
├── frontend/              # Next.js App Router (UI, WebRTC, TensorFlow)
└── README.md              # Project Installation Instructions
```

## 📜 License
This project is proprietary and confidential. All rights reserved.
