import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('tennessee', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="tennessee" language="haitian-creole" /> }
