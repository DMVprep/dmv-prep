import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('new-york', 2) }
export default function Page() { return <NumberedPracticeTest stateSlug="new-york" testNumber={2} /> }
