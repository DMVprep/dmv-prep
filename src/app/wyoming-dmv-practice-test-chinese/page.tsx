import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('wyoming', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="wyoming" language="chinese" /> }