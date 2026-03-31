import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('massachusetts', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="massachusetts" language="spanish" /> }
