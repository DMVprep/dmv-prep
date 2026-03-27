import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('illinois', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="illinois" language="haitian-creole" /> }
