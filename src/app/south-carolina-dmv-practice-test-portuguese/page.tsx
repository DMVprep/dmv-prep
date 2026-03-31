import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('south-carolina', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="south-carolina" language="portuguese" /> }
