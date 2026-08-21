import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function apiProxies(groqKey, hfToken) {
  return {
    '/api/groq': {
      target: 'https://api.groq.com',
      changeOrigin: true,
      rewrite: () => '/openai/v1/chat/completions',
      headers: groqKey ? { Authorization: `Bearer ${groqKey}` } : {},
    },
    '/api/hf-emotion': {
      target: 'https://router.huggingface.co',
      changeOrigin: true,
      rewrite: () =>
        '/hf-inference/models/j-hartmann/emotion-english-distilroberta-base',
      headers: hfToken ? { Authorization: `Bearer ${hfToken}` } : {},
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const groqKey = (env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || '').trim()
  const hfToken = (env.HF_TOKEN || env.HUGGINGFACE_TOKEN || '').trim()
  const proxy = apiProxies(groqKey, hfToken)

  return {
    plugins: [react()],
    server: {
      port: 5175,
      strictPort: true,
      proxy,
    },
    preview: {
      port: 5175,
      strictPort: true,
      proxy,
    },
  }
})
