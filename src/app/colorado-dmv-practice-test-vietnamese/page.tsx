import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('colorado', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="colorado" language="vietnamese" /> }
