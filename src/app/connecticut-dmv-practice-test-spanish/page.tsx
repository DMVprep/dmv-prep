import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('connecticut', 'spanish') }
export default function Page() { return <LanguagePracticePage stateSlug="connecticut" language="spanish" /> }
