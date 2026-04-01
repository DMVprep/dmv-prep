import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('delaware', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="delaware" language="portuguese" /> }