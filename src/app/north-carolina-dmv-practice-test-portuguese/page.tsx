import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('north-carolina', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="north-carolina" language="portuguese" /> }
