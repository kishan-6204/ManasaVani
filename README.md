# Manasa Vani (MVP Refactor)

Manasa Vani is now refactored into a production-leaning **client/server architecture**.

- **Client:** React (Vite), Firebase Authentication, mental-wellness chat UI.
- **Server:** Node + Express API, Gemini integration, validation, CORS, and rate limiting.
- **Security boundary:** Gemini API key is only available on the server.

## Architecture Diagram

```text
+---------------------------+            +-------------------------------+
|        React Client       |  HTTPS     |       Node/Express API        |
|  - Home + Auth UI         +----------->+  POST /api/chat               |
|  - Firebase Auth (client) |            |  - input validation           |
|  - Voice input/output     |            |  - rate limiting              |
+-------------+-------------+            |  - Gemini call (server only)  |
              |                          +---------------+---------------+
              | Firebase Auth SDK                        |
              v                                           v
      +-----------------+                        +----------------------+
      |    Firebase     |                        |      Gemini API      |
      |   Auth only     |                        |  (via server secret) |
      +-----------------+                        +----------------------+
```

## Folder Structure

```text
.
├── client/
│   ├── public/assets/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── config/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
├── server/
│   ├── routes/
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── README.md
```

## Setup

### 1) Start server

```bash
cd server
npm install
cp .env.example .env
# add your GEMINI_API_KEY
npm run dev
```

### 2) Start client

```bash
cd client
npm install
cp .env.example .env
# add your Firebase values
npm run dev
```

Client runs by default at `http://localhost:5173` and calls backend at `http://localhost:5000/api/chat`.

## Where API Keys Go

- **Gemini key**: `server/.env` as `GEMINI_API_KEY`.
- **Firebase client config**: `client/.env` with `VITE_FIREBASE_*` variables.

### Why Gemini key is server-only

If Gemini key is placed in frontend code, anyone can extract it from browser bundles/network logs and abuse your quota. Keeping it in server `.env` protects secrets and allows enforcement of controls (rate limiting, moderation, request shape validation).

## Auth Flow (Firebase)

- React client initializes Firebase Auth in `client/src/config/firebase.js`.
- Users can sign up/sign in with email/password or Google in `AuthModal`.
- Auth state is tracked in React and used to enable/disable chat actions.
- Gemini is never called from client, even for authenticated users.

## API Contract

### `POST /api/chat`

Request:

```json
{
  "message": "I feel anxious",
  "history": [{ "role": "user", "text": "I slept poorly" }],
  "language": "en-US"
}
```

Response:

```json
{
  "reply": "I'm here with you. Let's slow down with one deep breath...",
  "emotion": "anxious"
}
```

## Security and Validation (MVP)

Current protections:
- Express JSON size limits.
- Input validation for message length/type and history bounds.
- Rate limiting on `/api/*` routes.
- CORS locked to configured client origin.

Future moderation improvements:
- Add dedicated moderation layer before Gemini request.
- Add category-level block/transform rules.
- Store flagged events for human review and analytics.
- Add per-user/IP adaptive rate limits and abuse scoring.

## Known Limitations

- No persistent chat storage yet.
- Voice input currently uses `webkitSpeechRecognition` fallback path.
- Firebase profile metadata (name fields) is collected in UI but not persisted.
- Basic crisis handling prompt-based only (not full policy engine).

## Future Roadmap

- Store chat history with secure user scoping.
- Add richer mood timeline and journaling.
- Add multilingual quality tuning and locale-specific voices.
- Add moderation service + audit logs.
- Add unit/integration tests and CI pipeline.
