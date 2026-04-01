import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('north-dakota', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="north-dakota" language="haitian-creole" /> }