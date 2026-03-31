import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('louisiana', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="louisiana" language="chinese" /> }
