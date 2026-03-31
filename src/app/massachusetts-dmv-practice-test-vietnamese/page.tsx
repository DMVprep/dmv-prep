import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('massachusetts', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="massachusetts" language="vietnamese" /> }
