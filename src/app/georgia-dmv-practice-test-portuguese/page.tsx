import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('georgia', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="georgia" language="portuguese" /> }
