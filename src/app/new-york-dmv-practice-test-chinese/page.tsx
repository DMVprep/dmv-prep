import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-york', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="new-york" language="chinese" /> }
