import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('utah', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="utah" language="spanish" /> }
