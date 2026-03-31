import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('louisiana', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="louisiana" language="vietnamese" /> }
