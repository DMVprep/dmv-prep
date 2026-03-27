import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('california', 1) }
export default function Page() { return <NumberedPracticeTest stateSlug="california" testNumber={1} /> }
