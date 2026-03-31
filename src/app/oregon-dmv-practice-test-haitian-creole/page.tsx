import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('oregon', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="oregon" language="haitian-creole" /> }
