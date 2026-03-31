import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('maryland', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="maryland" language="haitian-creole" /> }
