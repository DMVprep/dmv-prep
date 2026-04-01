import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kentucky', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="kentucky" language="haitian-creole" /> }