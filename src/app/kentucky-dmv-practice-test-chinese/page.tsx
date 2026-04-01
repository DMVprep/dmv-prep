import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kentucky', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="kentucky" language="chinese" /> }