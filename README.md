# MindBridge AI

**Connecting minds to clarity**

MindBridge AI is a psychology wellness chatbot prototype built for the CCA assignment *Applications of AI in Psychology*. It provides reflection support, coping strategies, CBT psychoeducation, breathing exercises, and mood check-ins.

> **Disclaimer:** This is an educational prototype for academic purposes. It is not a substitute for professional mental health care.

## Features

- Groq-powered chat with conversation memory
- Parallel background specialists (reflection, CBT, coping) plus optional Hugging Face emotion tagging, synthesized into one reply
- Local crisis-keyword intercept (helplines shown, no API call)
- Keyword replies as fallback if Groq is unavailable
- Quick-action buttons (anxiety, CBT, breathing, mood, sleep, coping)
- Responsive design for desktop and mobile

## Tech Stack

- React 19
- Vite 8
- Groq Chat Completions API (proxied on localhost so the key stays off the page)
- Hugging Face Inference (optional emotion model, proxied on localhost)

## Getting Started

1. Copy `.env.example` to `.env` and add a free Groq key from [console.groq.com/keys](https://console.groq.com/keys):

```
GROQ_API_KEY=gsk_your_key_here
```

2. Optionally add a Hugging Face token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) so mood notes can be included:

```
HF_TOKEN=hf_your_token_here
```

Without `HF_TOKEN`, the chat still works; emotion tagging is skipped.

3. Install and run:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (`http://localhost:5175`).

Restart the dev server after changing `.env`. Without a Groq key, the app still runs using the built-in keyword replies.

## How a reply is built

After the local crisis check, MindBridge runs four background calls in parallel (Hugging Face emotion + three short Groq specialist notes). A final Groq composer turn weaves those notes into one natural reply. Specialist drafts are not shown in the chat and are not stored in conversation history.

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
│   ├── chatbot.js      # Crisis intercept + keyword fallback
│   ├── groq.js         # Groq client and composer system prompt
│   ├── sentiment.js    # Hugging Face emotion client
│   ├── specialists.js  # Parallel Groq specialist notes
│   └── orchestrate.js  # Fan-out, combine notes, compose reply
├── App.jsx         # Main app
└── App.css         # Styles
```

## Team

Add your group members here.

## License

Academic project — Psychology CCA 1
