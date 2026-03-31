import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('louisiana', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="louisiana" language="spanish" /> }
