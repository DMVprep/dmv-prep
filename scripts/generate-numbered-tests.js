const fs = require('fs'), path = require('path')
const states = ['florida','california','texas','new-york','pennsylvania','illinois','ohio','georgia','north-carolina','michigan']
let n = 0
states.forEach(s => {
  for (let i = 1; i <= 10; i++) {
    const dir = path.join(process.cwd(), 'app', 'state', s, `dmv-practice-test-${i}`)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'page.tsx'),
`import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('${s}', ${i}) }
export default function Page() { return <NumberedPracticeTest stateSlug="${s}" testNumber={${i}} /> }
`)
    console.log(`✓ /state/${s}/dmv-practice-test-${i}`); n++
  }
})
console.log(`\n✅ ${n} numbered test pages created`)
