import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('michigan', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="michigan" language="vietnamese" /> }
