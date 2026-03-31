import LanguagePracticePage, { buildLanguagePageMetadata } from '@/components/LanguagePracticePage'
import { Metadata } from 'next'
export function generateMetadata(): Metadata { return buildLanguagePageMetadata('nevada', 'portuguese') }
export default function Page() { return <LanguagePracticePage stateSlug="nevada" language="portuguese" /> }
