import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('north-dakota', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="north-dakota" language="chinese" /> }