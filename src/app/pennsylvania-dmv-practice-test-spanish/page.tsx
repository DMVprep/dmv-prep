import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('pennsylvania', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="pennsylvania" language="spanish" /> }
