import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('colorado', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="colorado" language="portuguese" /> }
