import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('maine', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="maine" language="vietnamese" /> }