import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-mexico', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="new-mexico" language="haitian-creole" /> }
