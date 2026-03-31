import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('iowa', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="iowa" language="spanish" /> }
