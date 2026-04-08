---
description: How to run the Opportunity Radar application
---

This workflow describes the steps to set up and run the Opportunity Radar backend and frontend.

### Prerequisites

1.  **Python 3.10+** installed.
2.  **Node.js & npm** installed.
3.  **Supabase** project set up with the schema provided in `backend/db/schema.sql`.

### 1. Environment Setup

Create a `.env` file in `opportunity-radar/backend/` with the following variables:
```env
ANTHROPIC_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
RESEND_API_KEY=your_key
TWILIO_SID=your_sid
TWILIO_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 2. Backend Setup

// turbo
1. Navigate to the backend directory:
   ```powershell
   cd opportunity-radar/backend
   ```
2. Install dependencies:
   ```powershell
   pip install crewai langchain-anthropic anthropic httpx yfinance pandas numpy supabase feedparser beautifulsoup4 apscheduler fastapi uvicorn python-dotenv loguru
   ```
3. Run the FastAPI server:
   ```powershell
   python main.py
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd opportunity-radar/frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

### 4. Verification

Visit `http://localhost:8000/health` to verify the backend is running.
Visit the frontend URL provided by the `npm run dev` output (usually `http://localhost:5173`) to see the dashboard.
