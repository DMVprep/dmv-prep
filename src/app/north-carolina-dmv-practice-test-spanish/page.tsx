import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('north-carolina', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="north-carolina" language="spanish" /> }
