import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('idaho', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="idaho" language="spanish" /> }