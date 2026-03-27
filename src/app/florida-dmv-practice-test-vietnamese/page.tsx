import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('florida', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="florida" language="vietnamese" /> }
