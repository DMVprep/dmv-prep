import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-mexico', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="new-mexico" language="spanish" /> }
