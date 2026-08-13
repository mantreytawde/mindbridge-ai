import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function groqProxy(apiKey) {
  const proxy = {
    '/api/groq': {
      target: 'https://api.groq.com',
      changeOrigin: true,
      rewrite: () => '/openai/v1/chat/completions',
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    },
  }

  return proxy
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = (env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || '').trim()

  return {
    plugins: [react()],
    server: {
      port: 5175,
      strictPort: true,
      proxy: groqProxy(apiKey),
    },
    preview: {
      port: 5175,
      strictPort: true,
      proxy: groqProxy(apiKey),
    },
  }
})
