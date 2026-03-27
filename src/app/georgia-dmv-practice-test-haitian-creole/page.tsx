import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('georgia', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="georgia" language="haitian-creole" /> }
