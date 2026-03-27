import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('florida', 10) }
export default function Page() { return <NumberedPracticeTest stateSlug="florida" testNumber={10} /> }
