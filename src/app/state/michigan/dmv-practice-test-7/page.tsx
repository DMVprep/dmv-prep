import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('michigan', 7) }
export default function Page() { return <NumberedPracticeTest stateSlug="michigan" testNumber={7} /> }
