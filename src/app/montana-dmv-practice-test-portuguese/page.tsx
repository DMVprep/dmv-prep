import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('montana', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="montana" language="portuguese" /> }