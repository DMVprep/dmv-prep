import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kentucky', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="kentucky" language="spanish" /> }