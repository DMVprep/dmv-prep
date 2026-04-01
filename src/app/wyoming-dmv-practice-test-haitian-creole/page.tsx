import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('wyoming', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="wyoming" language="haitian-creole" /> }