import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('missouri', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="missouri" language="portuguese" /> }