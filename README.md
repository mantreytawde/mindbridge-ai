# MindBridge AI

**Connecting minds to clarity**

MindBridge AI is a psychology wellness chatbot prototype built for the CCA assignment *Applications of AI in Psychology*. It provides reflection support, coping strategies, CBT psychoeducation, breathing exercises, and mood check-ins.

> **Disclaimer:** This is an educational prototype for academic purposes. It is not a substitute for professional mental health care.

## Features

- Groq-powered chat with conversation memory
- Local crisis-keyword intercept (helplines shown, no API call)
- Keyword replies as fallback if Groq is unavailable
- Quick-action buttons (anxiety, CBT, breathing, mood, sleep, coping)
- Responsive design for desktop and mobile

## Tech Stack

- React 19
- Vite 8
- Groq Chat Completions API (proxied on localhost so the key stays off the page)

## Getting Started

1. Copy `.env.example` to `.env` and add a free Groq key from [console.groq.com/keys](https://console.groq.com/keys):

```
GROQ_API_KEY=gsk_your_key_here
```

2. Install and run:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (`http://localhost:5175`).

Restart the dev server after changing `.env`. Without a key, the app still runs using the built-in keyword replies.

## Build for Demo

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # UI components (Header, ChatWindow, etc.)
├── utils/
│   ├── chatbot.js  # Crisis intercept + keyword fallback
│   └── groq.js     # Groq client and system prompt
├── App.jsx         # Main app
└── App.css         # Styles
```

## Team

Add your group members here.

## License

Academic project — Psychology CCA 1
