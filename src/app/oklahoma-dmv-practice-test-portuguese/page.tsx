import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('oklahoma', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="oklahoma" language="portuguese" /> }