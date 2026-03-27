import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('california', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="california" language="haitian-creole" /> }
