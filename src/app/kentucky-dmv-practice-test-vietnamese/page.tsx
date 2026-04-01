import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('kentucky', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="kentucky" language="vietnamese" /> }