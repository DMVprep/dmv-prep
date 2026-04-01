import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('idaho', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="idaho" language="haitian-creole" /> }