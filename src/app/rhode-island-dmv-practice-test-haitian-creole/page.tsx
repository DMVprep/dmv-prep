import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('rhode-island', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="rhode-island" language="haitian-creole" /> }