import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('washington', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="washington" language="spanish" /> }
