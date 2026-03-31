import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('nebraska', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="nebraska" language="chinese" /> }
