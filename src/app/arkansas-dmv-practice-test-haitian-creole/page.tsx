import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('arkansas', 'haitian-creole') }
export default function Page() { return <LanguagePracticePage stateSlug="arkansas" language="haitian-creole" /> }