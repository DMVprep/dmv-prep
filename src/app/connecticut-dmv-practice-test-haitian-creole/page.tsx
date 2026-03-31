import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('connecticut', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="connecticut" language="haitian-creole" /> }
