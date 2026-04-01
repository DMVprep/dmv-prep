import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('maine', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="maine" language="spanish" /> }