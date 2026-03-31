import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('virginia', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="virginia" language="chinese" /> }
