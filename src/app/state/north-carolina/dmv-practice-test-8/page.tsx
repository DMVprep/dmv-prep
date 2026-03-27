import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('north-carolina', 8) }
export default function Page() { return <NumberedPracticeTest stateSlug="north-carolina" testNumber={8} /> }
