import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('south-dakota', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="south-dakota" language="vietnamese" /> }