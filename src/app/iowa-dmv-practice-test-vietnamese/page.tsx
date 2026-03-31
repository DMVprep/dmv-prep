import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('iowa', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="iowa" language="vietnamese" /> }
