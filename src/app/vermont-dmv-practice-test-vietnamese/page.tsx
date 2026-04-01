import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('vermont', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="vermont" language="vietnamese" /> }