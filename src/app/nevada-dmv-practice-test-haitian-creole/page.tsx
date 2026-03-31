import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('nevada', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="nevada" language="haitian-creole" /> }
