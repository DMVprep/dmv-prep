import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('california', 4) }
export default function Page() { return <NumberedPracticeTest stateSlug="california" testNumber={4} /> }
