import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('nebraska', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="nebraska" language="vietnamese" /> }
