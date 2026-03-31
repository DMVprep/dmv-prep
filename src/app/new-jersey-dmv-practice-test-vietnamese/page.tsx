import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('new-jersey', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="new-jersey" language="vietnamese" /> }
