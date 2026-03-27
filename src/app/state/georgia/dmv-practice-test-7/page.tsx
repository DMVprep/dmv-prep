import NumberedPracticeTest, { buildNumberedTestMetadata } from '@/components/NumberedPracticeTest'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildNumberedTestMetadata('georgia', 7) }
export default function Page() { return <NumberedPracticeTest stateSlug="georgia" testNumber={7} /> }
