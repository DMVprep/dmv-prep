import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('hawaii', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="hawaii" language="spanish" /> }