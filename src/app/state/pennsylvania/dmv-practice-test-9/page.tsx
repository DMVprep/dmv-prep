import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('pennsylvania', 9) }
export default function Page() { return <NumberedPracticeTest stateSlug="pennsylvania" testNumber={9} /> }
