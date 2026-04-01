import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('hawaii', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="hawaii" language="portuguese" /> }