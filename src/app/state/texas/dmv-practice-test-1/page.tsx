import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('texas', 1) }
export default function Page() { return <NumberedPracticeTest stateSlug="texas" testNumber={1} /> }
