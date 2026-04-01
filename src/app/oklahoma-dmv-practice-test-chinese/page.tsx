import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('oklahoma', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="oklahoma" language="chinese" /> }