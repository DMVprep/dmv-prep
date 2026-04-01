import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('west-virginia', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="west-virginia" language="portuguese" /> }