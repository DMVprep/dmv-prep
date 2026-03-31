import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('indiana', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="indiana" language="vietnamese" /> }
