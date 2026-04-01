import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('alaska', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="alaska" language="vietnamese" /> }