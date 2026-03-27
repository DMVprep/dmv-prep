const fs = require('fs'), path = require('path')
const states = ['florida','california','texas','new-york','pennsylvania','illinois','ohio','georgia','north-carolina','michigan']
const langs = ['spanish','chinese','vietnamese','portuguese','haitian-creole']
let n = 0
states.forEach(s => langs.forEach(l => {
  const dir = path.join(process.cwd(), 'app', `${s}-dmv-practice-test-${l}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'page.tsx'),
`import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('${s}', '${l}') }
export default function Page() { return <LanguagePracticePage stateSlug="${s}" language="${l}" /> }
`)
  console.log(`✓ /${s}-dmv-practice-test-${l}`); n++
}))
console.log(`\n✅ ${n} language pages created`)
