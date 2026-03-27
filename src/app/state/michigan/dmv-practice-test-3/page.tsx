import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('michigan', 3) }
export default function Page() { return <NumberedPracticeTest stateSlug="michigan" testNumber={3} /> }
