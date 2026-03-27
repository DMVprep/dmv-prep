import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('michigan', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="michigan" language="chinese" /> }
