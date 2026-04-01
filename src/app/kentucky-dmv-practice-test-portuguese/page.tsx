import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kentucky', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="kentucky" language="portuguese" /> }