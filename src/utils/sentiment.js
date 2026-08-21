const HF_ENDPOINT = '/api/hf-emotion'
const TIMEOUT_MS = 8000

function parseTopEmotion(data) {
  let scores = data
  if (Array.isArray(data) && Array.isArray(data[0])) {
    scores = data[0]
  }
  if (!Array.isArray(scores) || scores.length === 0) return null

  const ranked = scores.filter((item) => item?.label && typeof item.score === 'number')
  if (!ranked.length) return null

  ranked.sort((a, b) => b.score - a.score)
  const top = ranked[0]
  return {
    label: String(top.label).toLowerCase(),
    score: top.score,
  }
}

export async function getEmotion(text) {
  const input = text?.trim()
  if (!input) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: input,
        options: { wait_for_model: true },
      }),
      signal: controller.signal,
    })

    if (!res.ok) return null

    const data = await res.json()
    if (data?.error) return null

    return parseTopEmotion(data)
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
