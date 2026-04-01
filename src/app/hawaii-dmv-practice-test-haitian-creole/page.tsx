import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('hawaii', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="hawaii" language="haitian-creole" /> }