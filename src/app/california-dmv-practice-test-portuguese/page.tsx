import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('california', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="california" language="portuguese" /> }
