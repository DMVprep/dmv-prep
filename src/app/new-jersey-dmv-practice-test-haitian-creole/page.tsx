import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-jersey', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="new-jersey" language="haitian-creole" /> }
