import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('alabama', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="alabama" language="haitian-creole" /> }
