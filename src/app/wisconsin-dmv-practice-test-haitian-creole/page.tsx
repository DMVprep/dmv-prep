import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('wisconsin', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="wisconsin" language="haitian-creole" /> }