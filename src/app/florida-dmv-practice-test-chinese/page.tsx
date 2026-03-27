import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('florida', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="florida" language="chinese" /> }
