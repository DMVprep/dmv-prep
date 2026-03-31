import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('washington', 'vietnamese') }
export default function Page() { return <LanguagePracticePage stateSlug="washington" language="vietnamese" /> }
