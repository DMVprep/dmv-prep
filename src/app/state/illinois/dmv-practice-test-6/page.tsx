import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('illinois', 6) }
export default function Page() { return <NumberedPracticeTest stateSlug="illinois" testNumber={6} /> }
