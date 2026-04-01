import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('vermont', 'chinese') }
export default function Page() { return <LanguagePracticePage stateSlug="vermont" language="chinese" /> }