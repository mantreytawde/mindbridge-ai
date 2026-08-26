# MindBridge AI

**Connecting minds to clarity**

MindBridge AI is a psychology wellness chatbot prototype built for the CCA assignment *Applications of AI in Psychology*. It provides reflection support, coping strategies, CBT psychoeducation, breathing exercises, and mood check-ins.

> **Disclaimer:** This is an educational prototype for academic purposes. It is not a substitute for professional mental health care.

## Features

- Groq-powered chat with full conversation memory (the UI sends the whole thread each turn)
- Parallel background specialists (reflection, CBT, coping) plus optional Hugging Face emotion tagging, synthesized into one reply
- Local crisis-keyword intercept on the server (helplines shown, no model call)
- Keyword replies as fallback if Groq is unavailable
- Thread kept in the browser (`localStorage`) so a refresh does not wipe a demo
- Quick-action buttons (anxiety, CBT, breathing, mood, sleep, coping)
- Responsive design for desktop and mobile

## Tech Stack

- React 19 + Vite 8 (frontend)
- Express on port 3001 (chat pipeline; Groq and Hugging Face keys stay on the server)
- Groq Chat Completions API
- Hugging Face Inference (optional emotion model)

## Getting Started

You need [Node.js](https://nodejs.org/) 18 or newer.

1. Copy `.env.example` to `.env` and add a free Groq key from [console.groq.com/keys](https://console.groq.com/keys):

```
GROQ_API_KEY=gsk_your_key_here
```

2. Optionally add a Hugging Face token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) so mood notes can be included:

```
HF_TOKEN=hf_your_token_here
```

Without `HF_TOKEN`, the chat still works; emotion tagging is skipped.

3. Install and run (starts the Express API and the Vite UI together):

```bash
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175). The UI proxies `/api` to Express on port 3001.

Restart the dev server after changing `.env`. Without a Groq key, the app still runs using the built-in keyword replies.

### One-URL laptop demo

After a production build, Express can serve the UI and `/api/chat` from a single origin:

```bash
npm run build
npm start
```

Open [http://localhost:3001](http://localhost:3001).

## How a reply is built

The browser POSTs the **full conversation** (welcome + every user and assistant turn) to `POST /api/chat`. The server then:

1. Runs a local crisis-keyword check on the latest user message. A match returns helplines immediately, with no model call.
2. Runs two background calls in parallel — optional Hugging Face emotion tagging and one internal Groq note-taker (reflection, CBT and coping bullets). Trivial turns such as "hi" or "thanks" skip the note-taker.
3. Runs a final Groq composer turn that weaves the notes into one reply. Notes are never shown in the chat.

The Groq API key is never sent to the browser.

### Token budget

Free Groq keys allow **8,000 tokens per minute per model**, which the pipeline is built around:

- One condensed system prompt (~2,300 tokens) instead of two overlapping prompts (~6,000).
- One merged note-taker instead of three parallel specialists.
- History is trimmed to a character budget, and if a call is rate limited the composer retries with a shorter history rather than falling back to canned text.

If replies ever come back as generic keyword text, the server logs the reason with a `[chat]` prefix. Setting `GROQ_MODEL` to a different model (for example `openai/gpt-oss-120b`) gives you a separate token budget.

## Project Structure

```
server/
├── index.js         # Express app (port 3001)
├── chatHandler.js   # POST /api/chat, crisis check, fallback
├── groq.js          # Groq client, retries, history budget
├── systemPrompt.js  # The single MindBridge system prompt
├── sentiment.js     # Hugging Face emotion client
├── specialists.js   # Internal note-taker
├── orchestrate.js   # Notes + emotion, then compose reply
└── chatbot.js       # Crisis keywords + topic-aware fallback replies
scripts/
├── personas.mjs     # 50 simulated patient conversations
├── simulate.mjs     # Replays them against the pipeline
├── analyze.mjs      # Scores transcripts for failures and repetition
├── show.mjs         # Prints a recorded conversation
├── probe.mjs        # Sends one message through the pipeline
└── probe-models.mjs # Checks per-model rate limits and budgets
src/
├── components/      # UI components (Header, ChatWindow, etc.)
├── utils/
│   └── chatbot.js   # Welcome copy and quick actions
├── App.jsx          # Main app (sends the full thread to /api/chat)
└── App.css          # Styles
```

## Testing the conversation quality

```bash
node scripts/simulate.mjs --model=openai/gpt-oss-20b --shard=0 --shards=3
node scripts/analyze.mjs
```

`simulate.mjs` replays scripted patient conversations (crisis, refusals, follow-ups, good news, jailbreaks, maths) through the real pipeline and writes transcripts to `results/`. `analyze.mjs` scores them for pipeline failures, clichés, repeated skills, near-duplicate replies, missed refusals, and over-triage; add `--groq-only` to exclude rate-limited turns, which all return the same canned text.

Pacing matters: the default 28s gap between turns keeps the run inside the free token budget. A full 50-conversation sweep costs well over 200,000 tokens, so it needs to be split across models or across days.

```bash
node scripts/probe.mjs --text="i broke up with my girlfriend"   # one turn, end to end
node scripts/probe-models.mjs                                   # remaining budget per model
node scripts/show.mjs "Abuse at home" --dir=results --turn=3     # read a recorded reply
```

## Team

Add your group members here.

## License

Academic project — Psychology CCA 1
