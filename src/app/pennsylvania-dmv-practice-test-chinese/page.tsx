import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('pennsylvania', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="pennsylvania" language="chinese" /> }
