import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('massachusetts', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="massachusetts" language="chinese" /> }
