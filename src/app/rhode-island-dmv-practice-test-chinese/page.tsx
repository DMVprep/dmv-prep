import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('rhode-island', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="rhode-island" language="chinese" /> }