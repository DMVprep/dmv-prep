import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('oklahoma', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="oklahoma" language="vietnamese" /> }