import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const turnFilter = argv
  .filter((a) => a.startsWith('--turn='))
  .map((a) => Number.parseInt(a.split('=')[1], 10))
const needle = argv.filter((a) => !a.startsWith('--')).join(' ').toLowerCase()
const dirArg = argv.find((a) => a.startsWith('--dir='))
const dir = path.join(process.cwd(), dirArg ? dirArg.split('=')[1] : 'results')

const rows = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.jsonl'))
  .flatMap((f) => fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)))
  .filter((r) => r.persona.toLowerCase().includes(needle))
  .filter((r) => !turnFilter.length || turnFilter.includes(r.turn))

for (const row of rows.sort((a, b) => a.model.localeCompare(b.model) || a.turn - b.turn)) {
  console.log(`\n[${row.model} | ${row.persona} | turn ${row.turn} | ${row.source} | ${row.ms}ms]`)
  console.log(`USER : ${row.userText}`)
  console.log(`BOT  : ${row.reply}`)
}
