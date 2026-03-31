import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-jersey', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="new-jersey" language="chinese" /> }
