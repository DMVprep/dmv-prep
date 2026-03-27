import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('ohio', 4) }
export default function Page() { return <NumberedPracticeTest stateSlug="ohio" testNumber={4} /> }
