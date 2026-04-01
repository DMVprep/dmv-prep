import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('oklahoma', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="oklahoma" language="spanish" /> }